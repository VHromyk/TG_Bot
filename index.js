require('dotenv').config()
// const { Telegraf } = require('telegraf')
const { Composer } = require('micro-bot')
const axios = require('axios')
// const bot = new Telegraf(process.env.BOT_TOKEN)
const bot = new Composer()

bot.start(ctx => {
	console.log(ctx.chat)
	ctx.reply(`Вітаю Вас ${ctx.message.from.first_name}!
	В цьому боті Ви можете взнати курс іноземної валюти.
	Для отримання курсу натисніть /show_currency`)
})

const currency = ['USD', 'EUR', 'PLN', 'RUB']

function filterArrByCurrency(el) {
	return currency.indexOf(el) !== -1
}

function shortCurrency(el) {
	return el.toFixed(2)
}

const getCurrency = async () =>
	await axios(
		'https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json'
	)
		.then(response => response.data)
		.then(arr => arr.filter(el => filterArrByCurrency(el.cc)))
		.then(arr =>
			arr.map(
				el =>
					`Дата: ${el.exchangedate}, 
					 Валюта: ${el.cc}, Курс: ${shortCurrency(el.rate)}`
			)
		)
		.then(arr => arr.join('\n'))

bot.command('show_currency', async ctx => {
	const result = await getCurrency()

	bot.telegram.sendMessage(ctx.chat.id, result)
})

// bot.launch()
module.exports = bot

// gentle-depths-42343
// https://gentle-depths-42343.herokuapp.com/
