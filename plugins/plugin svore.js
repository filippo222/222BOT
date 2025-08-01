import fs from 'fs'
import path from 'path'

const __dirname = path.dirname(new URL(import.meta.url).pathname)
const DB_PATH = path.join(__dirname, 'pokemon_data.json')

// Configurazioni
const RARITY_TIERS = {
    common: { chance: 0.50, minLevel: 1, maxLevel: 15, packPrice: 100, displayName: 'Comune' },
    uncommon: { chance: 0.30, minLevel: 5, maxLevel: 25, packPrice: 300, displayName: 'Non Comune' },
    rare: { chance: 0.15, minLevel: 10, maxLevel: 35, packPrice: 800, displayName: 'Raro' },
    epic: { chance: 0.04, minLevel: 20, maxLevel: 50, packPrice: 2000, displayName: 'Epico' },
    legendary: { chance: 0.009, minLevel: 30, maxLevel: 70, packPrice: 5000, displayName: 'Leggendario' },
    mythic: { chance: 0.001, minLevel: 50, maxLevel: 100, packPrice: 10000, displayName: 'Mitico' }
}

const CATCH_COOLDOWN = 60 * 60 * 1000 // 1 ora in millisecondi
const MAX_CATCHES_PER_COOLDOWN = 3

// Database Pokémon (esempio)
const POKEMON_DATABASE = [
    { id: 1, name: 'Bulbasaur', types: ['Grass', 'Poison'], rarity: 'uncommon', base_experience: 64 }, 
    { id: 2, name: 'Ivysaur', types: ['Grass', 'Poison'], rarity: 'rare', base_experience: 142 },
    { id: 3, name: 'Venusaur', types: ['Grass', 'Poison'], rarity: 'epic', base_experience: 263 },
    { id: 4, name: 'Charmander', types: ['Fire'], rarity: 'uncommon', base_experience: 62 },
    { id: 5, name: 'Charmeleon', types: ['Fire'], rarity: 'rare', base_experience: 142 },
    { id: 6, name: 'Charizard', types: ['Fire', 'Flying'], rarity: 'legendary', base_experience: 267 },
    { id: 7, name: 'Squirtle', types: ['Water'], rarity: 'uncommon', base_experience: 63 },
    { id: 8, name: 'Wartortle', types: ['Water'], rarity: 'rare', base_experience: 142 },
    { id: 9, name: 'Blastoise', types: ['Water'], rarity: 'epic', base_experience: 265 },
    { id: 10, name: 'Caterpie', types: ['Bug'], rarity: 'common', base_experience: 39 },
    { id: 11, name: 'Metapod', types: ['Bug'], rarity: 'common', base_experience: 72 },
    { id: 12, name: 'Butterfree', types: ['Bug', 'Flying'], rarity: 'uncommon', base_experience: 198 },
    { id: 13, name: 'Weedle', types: ['Bug', 'Poison'], rarity: 'common', base_experience: 39 },
    { id: 14, name: 'Kakuna', types: ['Bug', 'Poison'], rarity: 'common', base_experience: 72 },
    { id: 15, name: 'Beedrill', types: ['Bug', 'Poison'], rarity: 'uncommon', base_experience: 178 },
    { id: 16, name: 'Pidgey', types: ['Normal', 'Flying'], rarity: 'common', base_experience: 50 },
    { id: 17, name: 'Pidgeotto', types: ['Normal', 'Flying'], rarity: 'uncommon', base_experience: 122 },
    { id: 18, name: 'Pidgeot', types: ['Normal', 'Flying'], rarity: 'rare', base_experience: 216 },
    { id: 19, name: 'Rattata', types: ['Normal'], rarity: 'common', base_experience: 51 },
    { id: 20, name: 'Raticate', types: ['Normal'], rarity: 'uncommon', base_experience: 145 },
    { id: 21, name: 'Spearow', types: ['Normal', 'Flying'], rarity: 'common', base_experience: 52 },
    { id: 22, name: 'Fearow', types: ['Normal', 'Flying'], rarity: 'uncommon', base_experience: 155 },
    { id: 23, name: 'Ekans', types: ['Poison'], rarity: 'common', base_experience: 58 },
    { id: 24, name: 'Arbok', types: ['Poison'], rarity: 'uncommon', base_experience: 157 },
    { id: 25, name: 'Pikachu', types: ['Electric'], rarity: 'rare', base_experience: 112 },
    { id: 26, name: 'Raichu', types: ['Electric'], rarity: 'epic', base_experience: 243 },
    { id: 27, name: 'Sandshrew', types: ['Ground'], rarity: 'common', base_experience: 60 },
    { id: 28, name: 'Sandslash', types: ['Ground'], rarity: 'uncommon', base_experience: 158 },
    { id: 29, name: 'Nidoran♀', types: ['Poison'], rarity: 'common', base_experience: 55 },
    { id: 30, name: 'Nidorina', types: ['Poison'], rarity: 'uncommon', base_experience: 128 },
    { id: 31, name: 'Nidoqueen', types: ['Poison', 'Ground'], rarity: 'epic', base_experience: 253 },
    { id: 32, name: 'Nidoran♂', types: ['Poison'], rarity: 'common', base_experience: 55 },
    { id: 33, name: 'Nidorino', types: ['Poison'], rarity: 'uncommon', base_experience: 128 },
    { id: 34, name: 'Nidoking', types: ['Poison', 'Ground'], rarity: 'epic', base_experience: 253 },
    { id: 35, name: 'Clefairy', types: ['Fairy'], rarity: 'rare', base_experience: 113 },
    { id: 36, name: 'Clefable', types: ['Fairy'], rarity: 'epic', base_experience: 242 },
    { id: 37, name: 'Vulpix', types: ['Fire'], rarity: 'uncommon', base_experience: 60 },
    { id: 38, name: 'Ninetales', types: ['Fire'], rarity: 'epic', base_experience: 177 },
    { id: 39, name: 'Jigglypuff', types: ['Normal', 'Fairy'], rarity: 'uncommon', base_experience: 95 },
    { id: 40, name: 'Wigglytuff', types: ['Normal', 'Fairy'], rarity: 'rare', base_experience: 196 },
    { id: 41, name: 'Zubat', types: ['Poison', 'Flying'], rarity: 'common', base_experience: 49 },
    { id: 42, name: 'Golbat', types: ['Poison', 'Flying'], rarity: 'uncommon', base_experience: 159 },
    { id: 43, name: 'Oddish', types: ['Grass', 'Poison'], rarity: 'common', base_experience: 64 },
    { id: 44, name: 'Gloom', types: ['Grass', 'Poison'], rarity: 'uncommon', base_experience: 138 },
    { id: 45, name: 'Vileplume', types: ['Grass', 'Poison'], rarity: 'rare', base_experience: 245 },
    { id: 46, name: 'Paras', types: ['Bug', 'Grass'], rarity: 'common', base_experience: 57 },
    { id: 47, name: 'Parasect', types: ['Bug', 'Grass'], rarity: 'uncommon', base_experience: 142 },
    { id: 48, name: 'Venonat', types: ['Bug', 'Poison'], rarity: 'common', base_experience: 61 },
    { id: 49, name: 'Venomoth', types: ['Bug', 'Poison'], rarity: 'uncommon', base_experience: 158 },
    { id: 50, name: 'Diglett', types: ['Ground'], rarity: 'common', base_experience: 53 },
    { id: 51, name: 'Dugtrio', types: ['Ground'], rarity: 'uncommon', base_experience: 149 },
    { id: 52, name: 'Meowth', types: ['Normal'], rarity: 'common', base_experience: 58 },
    { id: 53, name: 'Persian', types: ['Normal'], rarity: 'uncommon', base_experience: 154 },
    { id: 54, name: 'Psyduck', types: ['Water'], rarity: 'common', base_experience: 64 },
    { id: 55, name: 'Golduck', types: ['Water'], rarity: 'uncommon', base_experience: 175 },
    { id: 56, name: 'Mankey', types: ['Fighting'], rarity: 'common', base_experience: 61 },
    { id: 57, name: 'Primeape', types: ['Fighting'], rarity: 'uncommon', base_experience: 159 },
    { id: 58, name: 'Growlithe', types: ['Fire'], rarity: 'uncommon', base_experience: 70 },
    { id: 59, name: 'Arcanine', types: ['Fire'], rarity: 'epic', base_experience: 194 },
    { id: 60, name: 'Poliwag', types: ['Water'], rarity: 'common', base_experience: 60 },
    { id: 61, name: 'Poliwhirl', types: ['Water'], rarity: 'uncommon', base_experience: 135 },
    { id: 62, name: 'Poliwrath', types: ['Water', 'Fighting'], rarity: 'rare', base_experience: 255 },
    { id: 63, name: 'Abra', types: ['Psychic'], rarity: 'rare', base_experience: 62 },
    { id: 64, name: 'Kadabra', types: ['Psychic'], rarity: 'epic', base_experience: 140 },
    { id: 65, name: 'Alakazam', types: ['Psychic'], rarity: 'legendary', base_experience: 250 },
    { id: 66, name: 'Machop', types: ['Fighting'], rarity: 'common', base_experience: 61 },
    { id: 67, name: 'Machoke', types: ['Fighting'], rarity: 'uncommon', base_experience: 142 },
    { id: 68, name: 'Machamp', types: ['Fighting'], rarity: 'rare', base_experience: 253 },
    { id: 69, name: 'Bellsprout', types: ['Grass', 'Poison'], rarity: 'common', base_experience: 60 },
    { id: 70, name: 'Weepinbell', types: ['Grass', 'Poison'], rarity: 'uncommon', base_experience: 137 },
    { id: 71, name: 'Victreebel', types: ['Grass', 'Poison'], rarity: 'rare', base_experience: 245 },
    { id: 72, name: 'Tentacool', types: ['Water', 'Poison'], rarity: 'common', base_experience: 67 },
    { id: 73, name: 'Tentacruel', types: ['Water', 'Poison'], rarity: 'uncommon', base_experience: 180 },
    { id: 74, name: 'Geodude', types: ['Rock', 'Ground'], rarity: 'common', base_experience: 60 },
    { id: 75, name: 'Graveler', types: ['Rock', 'Ground'], rarity: 'uncommon', base_experience: 137 },
    { id: 76, name: 'Golem', types: ['Rock', 'Ground'], rarity: 'rare', base_experience: 248 },
    { id: 77, name: 'Ponyta', types: ['Fire'], rarity: 'uncommon', base_experience: 82 },
    { id: 78, name: 'Rapidash', types: ['Fire'], rarity: 'rare', base_experience: 175 },
    { id: 79, name: 'Slowpoke', types: ['Water', 'Psychic'], rarity: 'common', base_experience: 63 },
    { id: 80, name: 'Slowbro', types: ['Water', 'Psychic'], rarity: 'uncommon', base_experience: 172 },
    { id: 81, name: 'Magnemite', types: ['Electric', 'Steel'], rarity: 'uncommon', base_experience: 65 },
    { id: 82, name: 'Magneton', types: ['Electric', 'Steel'], rarity: 'rare', base_experience: 163 },
    { id: 83, name: 'Farfetch\'d', types: ['Normal', 'Flying'], rarity: 'rare', base_experience: 132 },
    { id: 84, name: 'Doduo', types: ['Normal', 'Flying'], rarity: 'common', base_experience: 62 },
    { id: 85, name: 'Dodrio', types: ['Normal', 'Flying'], rarity: 'uncommon', base_experience: 165 },
    { id: 86, name: 'Seel', types: ['Water'], rarity: 'common', base_experience: 65 },
    { id: 87, name: 'Dewgong', types: ['Water', 'Ice'], rarity: 'uncommon', base_experience: 166 },
    { id: 88, name: 'Grimer', types: ['Poison'], rarity: 'common', base_experience: 65 },
    { id: 89, name: 'Muk', types: ['Poison'], rarity: 'uncommon', base_experience: 175 },
    { id: 90, name: 'Shellder', types: ['Water'], rarity: 'common', base_experience: 61 },
    { id: 91, name: 'Cloyster', types: ['Water', 'Ice'], rarity: 'rare', base_experience: 184 },
    { id: 92, name: 'Gastly', types: ['Ghost', 'Poison'], rarity: 'rare', base_experience: 62 },
    { id: 93, name: 'Haunter', types: ['Ghost', 'Poison'], rarity: 'epic', base_experience: 142 },
    { id: 94, name: 'Gengar', types: ['Ghost', 'Poison'], rarity: 'legendary', base_experience: 250 },
    { id: 95, name: 'Onix', types: ['Rock', 'Ground'], rarity: 'rare', base_experience: 77 },
    { id: 96, name: 'Drowzee', types: ['Psychic'], rarity: 'common', base_experience: 66 },
    { id: 97, name: 'Hypno', types: ['Psychic'], rarity: 'uncommon', base_experience: 169 },
    { id: 98, name: 'Krabby', types: ['Water'], rarity: 'common', base_experience: 65 },
    { id: 99, name: 'Kingler', types: ['Water'], rarity: 'uncommon', base_experience: 166 },
    { id: 100, name: 'Voltorb', types: ['Electric'], rarity: 'common', base_experience: 66 },
    { id: 101, name: 'Electrode', types: ['Electric'], rarity: 'uncommon', base_experience: 172 },
    { id: 102, name: 'Exeggcute', types: ['Grass', 'Psychic'], rarity: 'uncommon', base_experience: 65 },
    { id: 103, name: 'Exeggutor', types: ['Grass', 'Psychic'], rarity: 'rare', base_experience: 186 },
    { id: 104, name: 'Cubone', types: ['Ground'], rarity: 'uncommon', base_experience: 64 },
    { id: 105, name: 'Marowak', types: ['Ground'], rarity: 'rare', base_experience: 149 },
    { id: 106, name: 'Hitmonlee', types: ['Fighting'], rarity: 'epic', base_experience: 159 },
    { id: 107, name: 'Hitmonchan', types: ['Fighting'], rarity: 'epic', base_experience: 159 },
    { id: 108, name: 'Lickitung', types: ['Normal'], rarity: 'rare', base_experience: 77 },
    { id: 109, name: 'Koffing', types: ['Poison'], rarity: 'common', base_experience: 68 },
    { id: 110, name: 'Weezing', types: ['Poison'], rarity: 'uncommon', base_experience: 172 },
    { id: 111, name: 'Rhyhorn', types: ['Ground', 'Rock'], rarity: 'uncommon', base_experience: 69 },
    { id: 112, name: 'Rhydon', types: ['Ground', 'Rock'], rarity: 'rare', base_experience: 170 },
    { id: 113, name: 'Chansey', types: ['Normal'], rarity: 'epic', base_experience: 395 },
    { id: 114, name: 'Tangela', types: ['Grass'], rarity: 'rare', base_experience: 87 },
    { id: 115, name: 'Kangaskhan', types: ['Normal'], rarity: 'epic', base_experience: 172 },
    { id: 116, name: 'Horsea', types: ['Water'], rarity: 'common', base_experience: 59 },
    { id: 117, name: 'Seadra', types: ['Water'], rarity: 'uncommon', base_experience: 154 },
    { id: 118, name: 'Goldeen', types: ['Water'], rarity: 'common', base_experience: 64 },
    { id: 119, name: 'Seaking', types: ['Water'], rarity: 'uncommon', base_experience: 158 },
    { id: 120, name: 'Staryu', types: ['Water'], rarity: 'uncommon', base_experience: 68 },
    { id: 121, name: 'Starmie', types: ['Water', 'Psychic'], rarity: 'rare', base_experience: 182 },
    { id: 122, name: 'Mr. Mime', types: ['Psychic', 'Fairy'], rarity: 'epic', base_experience: 161 },
    { id: 123, name: 'Scyther', types: ['Bug', 'Flying'], rarity: 'epic', base_experience: 100 },
    { id: 124, name: 'Jynx', types: ['Ice', 'Psychic'], rarity: 'epic', base_experience: 159 },
    { id: 125, name: 'Electabuzz', types: ['Electric'], rarity: 'epic', base_experience: 172 },
    { id: 126, name: 'Magmar', types: ['Fire'], rarity: 'epic', base_experience: 173 },
    { id: 127, name: 'Pinsir', types: ['Bug'], rarity: 'epic', base_experience: 175 },
    { id: 128, name: 'Tauros', types: ['Normal'], rarity: 'epic', base_experience: 172 },
    { id: 129, name: 'Magikarp', types: ['Water'], rarity: 'common', base_experience: 40 },
    { id: 130, name: 'Gyarados', types: ['Water', 'Flying'], rarity: 'legendary', base_experience: 189 },
    { id: 131, name: 'Lapras', types: ['Water', 'Ice'], rarity: 'legendary', base_experience: 187 },
    { id: 132, name: 'Ditto', types: ['Normal'], rarity: 'epic', base_experience: 101 },
    { id: 133, name: 'Eevee', types: ['Normal'], rarity: 'rare', base_experience: 65 },
    { id: 134, name: 'Vaporeon', types: ['Water'], rarity: 'epic', base_experience: 184 },
    { id: 135, name: 'Jolteon', types: ['Electric'], rarity: 'epic', base_experience: 184 },
    { id: 136, name: 'Flareon', types: ['Fire'], rarity: 'epic', base_experience: 184 },
    { id: 137, name: 'Porygon', types: ['Normal'], rarity: 'epic', base_experience: 79 },
    { id: 138, name: 'Omanyte', types: ['Rock', 'Water'], rarity: 'epic', base_experience: 71 },
    { id: 139, name: 'Omastar', types: ['Rock', 'Water'], rarity: 'legendary', base_experience: 173 },
    { id: 140, name: 'Kabuto', types: ['Rock', 'Water'], rarity: 'epic', base_experience: 71 },
    { id: 141, name: 'Kabutops', types: ['Rock', 'Water'], rarity: 'legendary', base_experience: 173 },
    { id: 142, name: 'Aerodactyl', types: ['Rock', 'Flying'], rarity: 'legendary', base_experience: 180 },
    { id: 143, name: 'Snorlax', types: ['Normal'], rarity: 'legendary', base_experience: 189 },
    { id: 144, name: 'Articuno', types: ['Ice', 'Flying'], rarity: 'mythic', base_experience: 290 },
    { id: 145, name: 'Zapdos', types: ['Electric', 'Flying'], rarity: 'mythic', base_experience: 290 },
    { id: 146, name: 'Moltres', types: ['Fire', 'Flying'], rarity: 'mythic', base_experience: 290 },
    { id: 147, name: 'Dratini', types: ['Dragon'], rarity: 'legendary', base_experience: 60 },
    { id: 148, name: 'Dragonair', types: ['Dragon'], rarity: 'legendary', base_experience: 147 },
    { id: 149, name: 'Dragonite', types: ['Dragon', 'Flying'], rarity: 'mythic', base_experience: 300 },
    { id: 150, name: 'Mewtwo', types: ['Psychic'], rarity: 'mythic', base_experience: 340 },
    { id: 151, name: 'Mew', types: ['Psychic'], rarity: 'mythic', base_experience: 300 }
]

// Funzioni di database
function loadDB() {
    if (!fs.existsSync(DB_PATH)) return { users: {} }
    const data = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(data)
}

function saveDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// Funzioni helper
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function getRandomPokemon(pityCounter = 0) {
    let roll = Math.random()
    roll = roll * Math.pow(0.95, pityCounter / 10)
    
    let cumulative = 0
    let selectedRarity = 'common'

    for (const [rarity, { chance }] of Object.entries(RARITY_TIERS)) {
        cumulative += chance
        if (roll <= cumulative) {
            selectedRarity = rarity
            break
        }
    }

    const pool = POKEMON_DATABASE.filter(p => p.rarity === selectedRarity)
    if (pool.length === 0) return getRandomPokemon(pityCounter)

    const pokemon = { ...pickRandom(pool) }
    const tier = RARITY_TIERS[selectedRarity]
    pokemon.level = getRandomInt(tier.minLevel, tier.maxLevel)

    return pokemon
}

// Handler principale
let handler = async (m, { conn, args, command, usedPrefix }) => {
    const db = loadDB()
    const userId = m.sender
    const user = db.users[userId] || {
        pokemons: [],
        packInventory: { common: 1, uncommon: 0, rare: 0, epic: 0, legendary: 0, mythic: 0 },
        money: 1000,
        pityCounter: 0,
        lastCatchTime: 0,
        catchesInSession: 0,
        depositi: 0,
        prelievi: 0
    }

    if (!db.users[userId]) {
        db.users[userId] = user
        saveDB(db)
    }

    switch (command.toLowerCase()) {
        case 'cattura':
        case 'catch':
            await handleCatch(m, conn, user, db, usedPrefix)
            break

        case 'pokemon':
        case 'mypokemon':
            await showPokemonInfo(m, conn, user, args[0], usedPrefix)
            break

        case 'inventariopokemon':
        case 'inventory':
            await showInventory(m, conn, user, usedPrefix)
            break

        case 'pity':
            await showPityCounter(m, conn, user, usedPrefix)
            break

        case 'pacchetti':
        case 'packs':
            await showPacks(m, conn, user, usedPrefix)
            break

        case 'buypacchetti':
        case 'buypacks':
            await handleBuyPackMenu(m, conn, user, db, usedPrefix)
            break

        case 'compra':
        case 'buy':
            await handleBuyPack(m, conn, user, db, args[0], usedPrefix)
            break

        case 'apri':
        case 'open':
            await handleOpenPackMenu(m, conn, user, db, usedPrefix)
            break

        case 'apripacchetto':
            await handleOpenPack(m, conn, user, db, args[0], usedPrefix)
            break

        case 'portafoglio':
            await showPortafoglio(m, conn, user, usedPrefix)
            break

        case 'menupokemon':
        default:
            await showMainMenu(m, conn, usedPrefix)
    }
}

// Funzioni di gestione
async function handleCatch(m, conn, user, db, usedPrefix) {
    const now = Date.now()
    const cooldownEnd = user.lastCatchTime + CATCH_COOLDOWN
    
    if (now < cooldownEnd && user.catchesInSession >= MAX_CATCHES_PER_COOLDOWN) {
        const remainingTime = Math.ceil((cooldownEnd - now) / (60 * 1000))
        await conn.sendMessage(
            m.chat,
            {
                text: `⏳ Hai già effettuato ${MAX_CATCHES_PER_COOLDOWN} catture!\nPotrai catturare di nuovo tra ${remainingTime} minuti.`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 },
                    { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    if (now >= cooldownEnd) {
        user.lastCatchTime = now
        user.catchesInSession = 0
    }

    const pokemon = getRandomPokemon(user.pityCounter)
    const catchRate = Math.min(0.9, 0.3 + (pokemon.level / 100))
    const success = Math.random() < catchRate

    if (success) {
        user.pokemons.push({
            ...pokemon,
            id: Date.now(),
            caughtAt: new Date().toISOString(),
            iv: getRandomInt(0, 31),
            ev: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
        })
        user.pityCounter = 0
        user.money += 50 + (pokemon.level * 2) // Ricompensa in denaro
        user.catchesInSession++
        saveDB(db)

        await conn.sendMessage(
            m.chat,
            {
                text: `🎉 *Hai catturato ${pokemon.name}!*\n` +
                      `🔢 Livello: ${pokemon.level}\n` +
                      `🔮 Rarità: ${pokemon.rarity}\n` +
                      `⚡ Tipo: ${pokemon.types.join('/')}\n` +
                      `💰 Ricompensa: ${50 + (pokemon.level * 2)}€`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}pokemon ${pokemon.name}`, buttonText: { displayText: '📊 Vedi dettagli' }, type: 1 },
                    { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 },
                    { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
    } else {
        user.pityCounter++
        user.catchesInSession++
        saveDB(db)

        await conn.sendMessage(
            m.chat,
            {
                text: `😢 *${pokemon.name} è scappato!*\n📈 Pity: ${user.pityCounter}`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}cattura`, buttonText: { displayText: '🎣 Ritenta' }, type: 1 },
                    { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
    }
}

async function showPokemonInfo(m, conn, user, nameArg, usedPrefix) {
    if (!user.pokemons.length) {
        await conn.sendMessage(
            m.chat,
            {
                text: '❌ Nessun Pokémon trovato.'.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}cattura`, buttonText: { displayText: '🎣 Cattura Pokémon' }, type: 1 },
                    { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    const name = nameArg?.toLowerCase()
    const pokemon = name
        ? user.pokemons.find(p => p.name.toLowerCase() === name)
        : user.pokemons[user.pokemons.length - 1]

    if (!pokemon) {
        await conn.sendMessage(
            m.chat,
            {
                text: `❌ Pokémon "${nameArg}" non trovato.`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}inventariopokemon`, buttonText: { displayText: '📦 Inventario' }, type: 1 },
                    { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    const info = `
📛 *${pokemon.name}*
🔢 Livello: ${pokemon.level}
🔮 Rarità: ${pokemon.rarity}
⚡ Tipo: ${pokemon.types.join('/')}
🎯 IV: ${pokemon.iv}
📅 Preso: ${new Date(pokemon.caughtAt).toLocaleString()}
`.trim()

    await conn.sendMessage(
        m.chat,
        {
            text: info,
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}inventariopokemon`, buttonText: { displayText: '📦 Inventario' }, type: 1 },
                { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 },
                { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function showInventory(m, conn, user, usedPrefix) {
    const list = user.pokemons.map(p => `- ${p.name} (Lv.${p.level}, ${p.rarity})`).join('\n') || 'Nessun Pokémon catturato.'
    
    await conn.sendMessage(
        m.chat,
        {
            text: `📦 *Inventario:*\n${list}`.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}cattura`, buttonText: { displayText: '🎣 Cattura Pokémon' }, type: 1 },
                { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 },
                { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function showPityCounter(m, conn, user, usedPrefix) {
    await conn.sendMessage(
        m.chat,
        {
            text: `📉 *Pity Counter:* ${user.pityCounter}\n🔁 Più tentativi falliti, più aumentano le probabilità di trovare Pokémon rari!`.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}cattura`, buttonText: { displayText: '🎣 Cattura Pokémon' }, type: 1 },
                { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function showPacks(m, conn, user, usedPrefix) {
    const packs = user.packInventory
    const text = `🎁 *Pacchetti disponibili:*\n` +
        Object.entries(packs).map(([type, count]) => `- ${RARITY_TIERS[type].displayName}: ${count}x`).join('\n')

    await conn.sendMessage(
        m.chat,
        {
            text: text.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}apri`, buttonText: { displayText: '🎁 Apri pacchetti' }, type: 1 },
                { buttonId: `${usedPrefix}buypacchetti`, buttonText: { displayText: '🛒 Compra pacchetti' }, type: 1 },
                { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function handleBuyPackMenu(m, conn, user, db, usedPrefix) {
    const text = `🛒 *NEGOZIO PACCHETTI* 🛒\n\n` +
        `Scegli il tipo di pacchetto da acquistare:\n\n` +
        `- *Comune*: ${RARITY_TIERS.common.packPrice}€ (50% Comune, 30% Non Comune, 15% Raro...)\n` +
        `- *Non Comune*: ${RARITY_TIERS.uncommon.packPrice}€ (30% Comune, 50% Non Comune, 15% Raro...)\n` +
        `- *Raro*: ${RARITY_TIERS.rare.packPrice}€ (15% Comune, 30% Non Comune, 50% Raro...)\n` +
        `- *Epico*: ${RARITY_TIERS.epic.packPrice}€ (4% Comune, 15% Non Comune, 30% Raro, 50% Epico...)\n\n` +
        `💰 *Tuoi soldi:* ${user.money}€`

    await conn.sendMessage(
        m.chat,
        {
            text: text.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}compra common`, buttonText: { displayText: `💰 Comune (${RARITY_TIERS.common.packPrice}€)` }, type: 1 },
                { buttonId: `${usedPrefix}compra uncommon`, buttonText: { displayText: `💰 Non Comune (${RARITY_TIERS.uncommon.packPrice}€)` }, type: 1 },
                { buttonId: `${usedPrefix}compra rare`, buttonText: { displayText: `💰 Raro (${RARITY_TIERS.rare.packPrice}€)` }, type: 1 },
                { buttonId: `${usedPrefix}compra epic`, buttonText: { displayText: `🏆 Epico (${RARITY_TIERS.epic.packPrice}€)` }, type: 1 },
                { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 },
                { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function handleBuyPack(m, conn, user, db, type, usedPrefix) {
    if (!RARITY_TIERS[type]) {
        await conn.sendMessage(
            m.chat,
            {
                text: '❌ Tipo di pacchetto non valido.'.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}buypacchetti`, buttonText: { displayText: '🛒 Negozio' }, type: 1 },
                    { buttonId: `${usedPrefix}menu`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    const price = RARITY_TIERS[type].packPrice
    if (user.money < price) {
        await conn.sendMessage(
            m.chat,
            {
                text: `❌ Non hai abbastanza soldi! Ti servono ${price}€, ma hai solo ${user.money}€.`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}cattura`, buttonText: { displayText: '🎣 Cattura Pokémon' }, type: 1 },
                    { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    user.money -= price
    user.packInventory[type] = (user.packInventory[type] || 0) + 1
    saveDB(db)

    await conn.sendMessage(
        m.chat,
        {
            text: `✅ Hai acquistato 1 pacchetto ${RARITY_TIERS[type].displayName} per ${price}€!\n` +
                  `💰 Saldo rimanente: ${user.money}€`.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}apri`, buttonText: { displayText: '🎁 Apri pacchetti' }, type: 1 },
                { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function handleOpenPackMenu(m, conn, user, db, usedPrefix) {
    const availablePacks = Object.entries(user.packInventory)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({ type, count }))

    if (availablePacks.length === 0) {
        await conn.sendMessage(
            m.chat,
            {
                text: `❌ Non hai nessun pacchetto da aprire!\nVisita il negozio per acquistarne alcuni.`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}buypacchetti`, buttonText: { displayText: '🛒 Compra pacchetti' }, type: 1 },
                    { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    const packList = availablePacks.map(pack => 
        `- ${RARITY_TIERS[pack.type].displayName}: ${pack.count}x`
    ).join('\n')

    const buttons = []
    for (let i = 0; i < availablePacks.length; i += 3) {
        const row = availablePacks.slice(i, i + 3).map(pack => ({
            buttonId: `${usedPrefix}apripacchetto ${pack.type}`,
            buttonText: { displayText: `🎁 ${RARITY_TIERS[pack.type].displayName} (x${pack.count})` },
            type: 1
        }))
        buttons.push(...row)
    }

    buttons.push(
        { buttonId: `${usedPrefix}buypacchetti`, buttonText: { displayText: '🛒 Compra pacchetti' }, type: 1 },
        { buttonId: `${usedPrefix}menupokemon`, buttonText: { displayText: '🔙 Menu' }, type: 1 }
    )

    await conn.sendMessage(
        m.chat,
        {
            text: `📦 *PACCHETTI DISPONIBILI* 📦\n\n${packList}\n\nScegli quale pacchetto aprire:`.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: buttons,
            headerType: 1
        },
        { quoted: m }
    )
}

async function handleOpenPack(m, conn, user, db, type, usedPrefix) {
    if (!user.packInventory[type] || user.packInventory[type] <= 0) {
        await conn.sendMessage(
            m.chat,
            {
                text: `❌ Non hai pacchetti di tipo "${type}".`.trim(),
                footer: '✦ Scegli un\'opzione:',
                buttons: [
                    { buttonId: `${usedPrefix}apri`, buttonText: { displayText: '🎁 Altri pacchetti' }, type: 1 },
                    { buttonId: `${usedPrefix}buypacchetti`, buttonText: { displayText: '🛒 Compra pacchetti' }, type: 1 }
                ],
                headerType: 1
            },
            { quoted: m }
        )
        return
    }

    user.packInventory[type]--
    const pokemon = getRandomPokemon()
    user.pokemons.push({
        ...pokemon,
        id: Date.now(),
        caughtAt: new Date().toISOString(),
        iv: getRandomInt(0, 31),
        ev: { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 }
    })
    saveDB(db)

    await conn.sendMessage(
        m.chat,
        {
            text: `📦 *Hai aperto un pacchetto ${RARITY_TIERS[type].displayName}!*\n\n` +
                  `🎉 *${pokemon.name}*\n` +
                  `🔢 Livello: ${pokemon.level}\n` +
                  `🔮 Rarità: ${pokemon.rarity}\n` +
                  `⚡ Tipo: ${pokemon.types.join('/')}\n\n` +
                  `📊 *Pacchetti rimasti:*\n` +
                  `- ${RARITY_TIERS[type].displayName}: ${user.packInventory[type]}x`.trim(),
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}pokemon ${pokemon.name}`, buttonText: { displayText: '📊 Vedi dettagli' }, type: 1 },
                { buttonId: `${usedPrefix}apripacchetto ${type}`, buttonText: { displayText: `🎁 Apri altro ${RARITY_TIERS[type].displayName}` }, type: 1 },
                { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

async function showPortafoglio(m, conn, user, usedPrefix) {
    
}

async function showMainMenu(m, conn, usedPrefix) {
    const menu = `
⚡ *Pokémon Menu* ⚡

💰 *Sistema Monetario*
- Guadagni soldi catturando Pokémon
- I pacchetti costano in base alla rarità

🎮 *Gameplay*
- 3 catture ogni ora
- Più fallisci, più aumentano le probabilità di trovare rari

📦 *Pacchetti*
- .buypacchetti - Acquista nuovi pacchetti
- .apri - Apri i pacchetti che hai
    `.trim()

    await conn.sendMessage(
        m.chat,
        {
            text: menu,
            footer: '✦ Scegli un\'opzione:',
            buttons: [
                { buttonId: `${usedPrefix}cattura`, buttonText: { displayText: '🎣 Cattura Pokémon' }, type: 1 },
                { buttonId: `${usedPrefix}inventariopokemon`, buttonText: { displayText: '📦 Inventario' }, type: 1 },
                { buttonId: `${usedPrefix}buypacchetti`, buttonText: { displayText: '🛒 Negozio' }, type: 1 },
                { buttonId: `${usedPrefix}apri`, buttonText: { displayText: '🎁 Apri pacchetti' }, type: 1 },
                { buttonId: `${usedPrefix}portafoglio`, buttonText: { displayText: '💰 Portafoglio' }, type: 1 }
            ],
            headerType: 1
        },
        { quoted: m }
    )
}

// Configurazione
handler.help = [
    'cattura', 
    'pokemon', 
    'inventario', 
    'pity', 
    'pacchetti', 
    'buypacchetti', 
    'compra', 
    'apri', 
    'apripacchetto',
    'portafoglio'
].map(c => 'pokemon ' + c)

handler.tags = ['game']
handler.command = /^(pokemon|cattura|catch|mypokemon|inventariopokemon|inventory|pity|pacchetti|packs|buypacchetti|buypacks|compra|buy|apri|open|apripacchetto|portaoglio|menupokemon)$/i

export default handler
         