import { storageService } from './storage.service.js'
import { utilService } from './util.service.js'
import axios from 'axios'
import FastAverageColor from 'fast-average-color'


export const designService = {
    getImgs,
    query,
    getAvgColor,
    getImgsLarge
}

const DESIGN_KEY = 'designDB'

async function getImgs(amount = 6, searchWord = 'desktop background', size = 'small') {
    const imgs = await axios.get(`https://api.unsplash.com/search/photos?client_id=QTIqWCQzY5ksfEbIUOklkb-vvjwfZZUeWemdkfe0IjA&per_page=${amount}&query=${searchWord}`)
    console.log(size)
    return imgs.data.results.map(res => res.urls[size])
}
async function getImgsLarge(amount = 6, searchWord = 'desktop background') {
    const imgs = await axios.get(`https://api.unsplash.com/search/photos?client_id=QTIqWCQzY5ksfEbIUOklkb-vvjwfZZUeWemdkfe0IjA&per_page=${amount}&query=${searchWord}`)
    return imgs.data.results.map(res => res.urls.regular)
}


async function query() {
    return storageService.query(DESIGN_KEY)
}
async function getAvgColor(imgUrl) {
    const fac = new FastAverageColor();
    const color = await fac.getColorAsync(imgUrl)
    return color

}

_createDesignlist()

async function _createDesignlist() {
    var design = await storageService.query(DESIGN_KEY)
    if (!design || !design.length) {
        design = {
            imgs: [
                {
                    _id: utilService.makeId(),
                    url: 'https://res.cloudinary.com/shemer/image/upload/v1651394520/garrett-parker-DlkF4-dbCOU-unsplash_fsgk4u_ipzbja.jpg'
                },
                {
                    _id: utilService.makeId(),
                    url: 'https://res.cloudinary.com/shemer/image/upload/v1651394505/cristina-gottardi-CSpjU6hYo_0-unsplash_iyf4kk_anxqia.jpg'
                },
                {
                    _id: utilService.makeId(),
                    url: 'https://res.cloudinary.com/shemer/image/upload/v1651394494/samantha-gades-BlIhVfXbi9s-unsplash_x6l6ky_f2fl7d.jpg'
                },
                {
                    _id: utilService.makeId(),
                    url: 'https://res.cloudinary.com/shemer/image/upload/v1651394485/taylor-simpson-iwDwf4C80Io-unsplash_dlvqa0_wa8s5k.jpg'
                },
                {
                    _id: utilService.makeId(),
                    url: 'https://res.cloudinary.com/shemer/image/upload/v1651394475/luca-micheli-ruWkmt3nU58-unsplash_nfkucz_wbpliw.jpg'
                },
                {
                    _id: utilService.makeId(),
                    url: 'https://res.cloudinary.com/shemer/image/upload/v1651394339/fabian-quintero-UWQP2mh5YJI-unsplash_gftphd_enqfmu.jpg'
                },
            ],
            colors: [
                {
                    id: utilService.makeId(),
                    color: '#61bd4f'
                },
                {
                    id: utilService.makeId(),
                    color: '#f2d600'
                },
                {
                    id: utilService.makeId(),
                    color: '#ff9f1a'
                },
                {
                    id: utilService.makeId(),
                    color: '#eb5a46'
                },
                {
                    id: utilService.makeId(),
                    color: '#c377e0'
                },
                {
                    id: utilService.makeId(),
                    color: '#0079bf'
                },
                {
                    id: utilService.makeId(),
                    color: '#00c2e0'
                },
                {
                    id: utilService.makeId(),
                    color: '#51e898'
                },
                {
                    id: utilService.makeId(),
                    color: '#ff78cb'
                },
                {
                    id: utilService.makeId(),
                    color: '#344563'
                },
            ],
            suggestedSearches: [
                'Productivity', 'Prespective', 'Organization', 'Colorful', 'Nature', 'Business', 'Minimal', 'Space', 'Animal'
            ]
        }
        storageService.post(DESIGN_KEY, design)
    }
}

// function _createImgList()