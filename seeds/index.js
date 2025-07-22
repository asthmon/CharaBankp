//Mongoose Set up
const mongoose = require('mongoose');
const Waifulocation = require('../models/waifuground')
mongoose.connect('mongodb://localhost:27017/waifuLoc');
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Conected')
});

//Cities Module
const cities = require('./cities');
const waifuNames = require('./waifunameSeeds')

const seeddb = async () => {
    await Waifulocation.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const waifus = Object.values(waifuNames)
        const randAge = Math.floor(Math.random() * 25 + 10)
        const waifu = new Waifulocation({
            author: '687a33d95dde8637193a3b2d',
            name: waifus[0][i],
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: `https://media.tenor.com/1rkyTODR2qQAAAAi/rikka-takanashi-takanashi-rikka.gif`,
            description: "和キネ狙馬テクソ年気ぼぶざラ策情切ネハワ範初ぐせ覧警サナテヘ学構実ク授社戦り議恥カヘ公円フエマ織赤張挑社いこげよ情領玲心北と。返シ役他ロユタ害長びはふせ後全ヱユケク関発シネサ契手あスで写1同がに各合ヱス伝活だゅイへ守健朝テホヘエ状勇続フつ。",
            age: randAge
        })
        await waifu.save()
    }

}

const update = async () => {
    const newDatas = await Waifulocation.updateMany({}, {
        images: [{
            url: 'https://res.cloudinary.com/drltvwfnh/image/upload/v1753012126/CharaBank/gslgid0ehpvtmn12ylqq.gif',
            filename: 'CharaBank/gslgid0ehpvtmn12ylqq',

        }]
    })
    console.log(newDatas)
}

update().then(() => {
    mongoose.connection.close()
})