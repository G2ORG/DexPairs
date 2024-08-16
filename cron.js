'use strict'

import cp from 'child_process'

const backFolder = './back'



const MAIN_TIMEOUT = process.env.NODE_ENV === 'production' ? 720000 : 360000 // 12 minutes or 6 minutes
const COINGECKO_TIMEOUT = process.env.NODE_ENV === 'production' ? 25000 : 45000 // 25 or 45 seconds


start()


/* MAIN */
async function start() {

	setTimeout(launchMain, 1000)

	setTimeout(launchCoingecko, 4000)

}


async function launchMain() {
	setTimeout(launchMain, MAIN_TIMEOUT)

	cp.fork(backFolder + '/back.js')
}


async function launchCoingecko() {
	setTimeout(launchCoingecko, COINGECKO_TIMEOUT)

	cp.fork(backFolder + '/coingecko.js')
}
