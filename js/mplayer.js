/**
* Query and parse Icecast and Shoutcast directories
* @module Mplayer
**/
'use strict'

const fs    = require('fs');
const path  = require('path');
const exec  = require('child_process').exec;
const spawn = require('child_process').spawn;


/**
* TODO
*
* In progress
* - Wait for some time after io
*
**/


// Constants
const KILL_CMD = 'Taskkill /IM mplayer.exe /F';
const WAIT_IO  = 100;

// Global variables
var mplayer;


/**
* kill :: Function -> IO()
* @method kill
* @description Kill all mplayer processes
* @param {Function} f (Optional) Callback function
**/
function kill(f) {
    exec(KILL_CMD, f);
}

/**
* play :: String -> Bool -> Function? -> IO()
* @method play
* @description Play a url with mplayer
* @param {String}   url URL
* @param {Bool}     is_playlist Whether to launch mplayer with the -playlist argument
* @param {Function} f (Optional) Callback function
**/
function play(url, is_playlist, f) {
    const args = is_playlist
        ? ['-slave', '-playlist', url]
        : ['-slave', url];
    
    stop( () => {
        mplayer = spawn('mplayer', args, {
            detached : true,
            stdio    : ['pipe', 'ignore', 'ignore']
        });
        
        if(f !== undefined) setTimeout(f, WAIT_IO);
    });
}

/**
* pause :: IO()
* @method pause
* @description Pause mplayer
* @param {Function} f (Optional) Callback function
**/
function pause(f) {
    if(mplayer !== undefined) {
        mplayer.stdin.write('pause\n');
        
        if(f !== undefined) setTimeout(f, WAIT_IO);
    }
}

/**
* volume :: String -> IO()
* @method volume
* @description Change volume
* @param {String} n Relative value to change volume by preceded by sign
**/
function volume(n) {
    if(mplayer !== undefined) {
        mplayer.stdin.write('volume ' + n + ' 0\n');
    }
}

/**
* stop :: Function? -> IO()
* @method stop
* @description Stop mplayer
* @param {Function} f (Optional) Callback function
**/
function stop(f) {
    if(mplayer !== undefined) {
        mplayer.stdin.write('stop\n');
        mplayer = undefined;
        
        if(f !== undefined) setTimeout(f, WAIT_IO);
    }
    else {
        if(f !== undefined) setTimeout(f, WAIT_IO);
    }
}


module.exports = {
    play     : play,
    stop     : stop,
    pause    : pause,
    volume   : volume,
    kill     : kill
}