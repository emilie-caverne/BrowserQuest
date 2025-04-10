const fs = require('fs');
const Metrics = require('./metrics');
const ws = require("./ws");
const WorldServer = require("./worldserver");
const Log = require('log');
const _ = require('underscore');
const Player = require('./player'); 

function main(config) {
    const server = new ws.socketIOServer(config.host, config.port);
    const metrics = config.metrics_enabled ? new Metrics(config) : null;
    const worlds = [];
    let lastTotalPlayers = 0;
    
    const checkPopulationInterval = setInterval(function() {
        if(metrics && metrics.isReady) {
            metrics.getTotalPlayers(function(totalPlayers) {
                if(totalPlayers !== lastTotalPlayers) {
                    lastTotalPlayers = totalPlayers;
                    _.each(worlds, function(world) {
                        world.updatePopulation(totalPlayers);
                    });
                }
            });
        }
    }, 1000);
    
    let log;
    switch (config.debug_level) {
        case "error":
            log = new Log(Log.ERROR);
            break;
        case "debug":
            log = new Log(Log.DEBUG);
            break;
        case "info":
            log = new Log(Log.INFO); 
            break;
        default:
            log = new Log(Log.INFO);
    }
    
    console.log("Starting BrowserQuest game server...");
    
    server.onConnect(function(connection) {
        let world; 
        const connect = function() {
            if(world) {
                world.connect_callback(new Player(connection, world, log));
            }
        };
        
        if(metrics) {
            metrics.getOpenWorldCount(function(open_world_count) {
                world = _.min(_.first(worlds, open_world_count), function(w) { return w.playerCount; });
                connect();
            });
        }
        else {
            world = _.detect(worlds, function(world) {
                return world.playerCount < config.nb_players_per_world;
            });
            world.updatePopulation();
            connect();
        }
    });
    
    server.onError(function() {
        log.error(Array.prototype.join.call(arguments, ", "));
    });
    
    const onPopulationChange = function() {
        metrics.updatePlayerCounters(worlds, function(totalPlayers) {
            _.each(worlds, function(world) {
                world.updatePopulation(totalPlayers);
            });
        });
        metrics.updateWorldDistribution(getWorldDistribution(worlds));
    };
    
    _.each(_.range(config.nb_worlds), function(i) {
        const world = new WorldServer('world' + (i + 1), config.nb_players_per_world, server);
        world.run(config.map_filepath);
        worlds.push(world);
        if(metrics) {
            world.onPlayerAdded(onPopulationChange);
            world.onPlayerRemoved(onPopulationChange);
        }
    });
    
    server.onRequestStatus(function() {
        return JSON.stringify(getWorldDistribution(worlds));
    });
    
    if(config.metrics_enabled) {
        metrics.ready(function() {
            onPopulationChange();
        });
    }
    process.on('uncaughtException', function(e) {
        log.error('uncaughtException:', e.stack || e);
    });
}

function getWorldDistribution(worlds) {
    const distribution = [];
    _.each(worlds, function(world) {
        distribution.push(world.playerCount);
    });
    return distribution;
}

function getConfigFile(path, callback) {
    fs.readFile(path, function(err, json_string) {
        if(err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}

const defaultConfigPath = './server/config.json';
const customConfigPath = './server/config.json';

process.argv.forEach(function (val, index) {
    if(index === 2) {
        customConfigPath = val;
    }
});

getConfigFile(defaultConfigPath, function(defaultConfig) {
    console.log('defaultConfigPath:', defaultConfigPath);
    console.log('customConfigPath:', customConfigPath);
    getConfigFile(customConfigPath, function(localConfig) {
        if(localConfig) {
            main(localConfig);
        } else if(defaultConfig) {
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });
});
