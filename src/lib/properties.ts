import marbella from '@/assets/marbella-villa.jpg'
import paris from '@/assets/paris-apartment.jpg'
import tuscany from '@/assets/tuscany-home.jpg'
import mallorca from '@/assets/mallorca-villa.jpg'
export const properties = [
 {id:'marbella-villa', title:'Contemporary Mediterranean villa', location:'Marbella, Spain', country:'Spain', price:2450000, beds:4, baths:4, area:320, type:'Villa', purpose:'buy', image:marbella, tag:'FEATURED', description:'An exceptional contemporary retreat beneath the Sierra Blanca mountains. Light-filled living spaces open onto landscaped gardens and a private pool, bringing the Mediterranean lifestyle into every room.'},
 {id:'paris-apartment', title:'A timeless Parisian apartment', location:'Paris, France', country:'France', price:1280000, beds:3, baths:2, area:145, type:'Apartment', purpose:'buy', image:paris, tag:'NEW LISTING', description:'Classic Parisian character meets beautifully considered modern living. High ceilings, original detailing and generous French windows create a calm, light-filled home in the heart of the city.'},
 {id:'tuscany-estate', title:'A countryside escape in Tuscany', location:'Florence, Italy', country:'Italy', price:1890000, beds:5, baths:4, area:410, type:'House', purpose:'buy', image:tuscany, tag:'EXCLUSIVE', description:'Surrounded by rolling vineyards and mature olive trees, this beautifully restored stone home offers a slower pace of life. A private pool and generous terraces frame sweeping countryside views.'},
 {id:'mallorca-retreat', title:'The coastal residence', location:'Mallorca, Spain', country:'Spain', price:8500, beds:4, baths:3, area:280, type:'Villa', purpose:'rent', image:mallorca, tag:'FOR RENT', description:'A beautifully crafted coastal residence with uninterrupted sea views, an infinity pool and expansive indoor-outdoor living. Available for long-term rental.'},
]
export type Property = typeof properties[number]
export const priceLabel = (p: Property) => new Intl.NumberFormat('en-US',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(p.price) + (p.purpose==='rent' ? ' / month' : '')
export const metadata = (title:string, description:string) => ({meta:[{title:`${title} — Red Home`},{name:'description',content:description},{property:'og:title',content:`${title} — Red Home`},{property:'og:description',content:description},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}]})
