const waifu = require('./waifunameSeeds')

for (let i = 0; i < 50; i++) {
    const waifus = Object.values(waifu)
    console.log(waifus[0][i])
}

