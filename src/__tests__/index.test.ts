import anyTest, { TestFn } from 'ava'

import { checkTitle } from '../../dist/index.js'
// eslint-disable-next-line import/extensions
import { IMPERATIVE_ERROR, LENGTH_ERROR, LENGTH_WARNING } from '../messages'

const test = anyTest as TestFn<GlobalContext>

interface GlobalContext {
	warn: string[]
	message: string[]
	fail: string[]
	markdown: string[]
}

declare const global: {
	warn: (m: string) => void
	message: (m: string) => void
	fail: (m: string) => void
	markdown: (m: string) => void
	danger: unknown
}

test.beforeEach((t) => {
	t.context.warn = []
	t.context.message = []
	t.context.fail = []
	t.context.markdown = []
	global.warn = (m: string) => t.context.warn.push(m)
	global.message = (m: string) => t.context.message.push(m)
	global.fail = (m: string) => t.context.fail.push(m)
	global.markdown = (m: string) => t.context.markdown.push(m)
})

function checkPr({ title }: { title: string }) {
	global.danger = {
		github: { pr: { title } },
	}

	checkTitle()
}

test.serial('show failure when not using imperative mood', async (t) => {
	checkPr({ title: 'Fixes a bug in production' })
	t.true(t.context.fail.includes(IMPERATIVE_ERROR))
})

test.serial('shows no message when using imperative mood', async (t) => {
	checkPr({ title: 'Fix a bug in production' })
	t.false(t.context.fail.includes(IMPERATIVE_ERROR))
})

test.serial('can set a custom response level', async (t) => {
	checkTitle('fixes a bug in production.', { imperativeMood: 'warn' })
	t.false(t.context.fail.includes(IMPERATIVE_ERROR))
	t.true(t.context.warn.includes(IMPERATIVE_ERROR))
})

test.serial('warns when a title is between 50 and 72 characters', async (t) => {
	checkTitle('warns when a title is between 50 and 72 characters.')
	t.true(t.context.warn.includes(LENGTH_WARNING))
})

test.serial(
	'shows a failure when a title is greater than 72 characters',
	async (t) => {
		checkTitle(
			'Advanced bullshit cutting-edge cable Chiba sanpaku amalgam unfolding psychoactive program.'
		)
		t.true(t.context.fail.includes(LENGTH_ERROR))
	}
)

test.serial('logs no message when set to returnOnly', async (t) => {
	checkTitle('fixes a bug in production.', { returnOnly: true })
	t.is(t.context.fail.length, 0)
	t.is(t.context.warn.length, 0)
	t.is(t.context.message.length, 0)
	t.is(t.context.markdown.length, 0)
})
