/* eslint-disable no-return-assign */
import anyTest, { TestFn } from 'ava'

// eslint-disable-next-line import/extensions
import { checkTitle } from '../index'

const test = anyTest as TestFn<GlobalContext>

interface GlobalContext {
	warn: string
	message: string
	fail: string
	markdown: string
}

declare const global: {
	warn: (m: string) => void
	message: (m: string) => void
	fail: (m: string) => void
	markdown: (m: string) => void
	danger: unknown
}

test.beforeEach((t) => {
	global.warn = (m: string) => (t.context.warn = m)
	global.message = (m: string) => (t.context.message = m)
	global.fail = (m: string) => (t.context.fail = m)
	global.markdown = (m: string) => (t.context.markdown = m)
})

test.afterEach((t) => {
	global.warn = () => (t.context.warn = '')
	global.message = () => (t.context.message = '')
	global.fail = () => (t.context.fail = '')
	global.markdown = () => (t.context.markdown = '')
})

function checkPr({ title }: { title: string }) {
	global.danger = {
		github: { pr: { title } },
	}

	checkTitle()
}

test.serial('show failure when not using imperative mood', async (t) => {
	checkPr({ title: 'Fixes a bug in production' })
	t.is(t.context.fail, 'PR titles should use the imperative mood.')
})

test.serial('shows no message when using imperative mood', async (t) => {
	checkPr({ title: 'Fix a bug in production' })
	t.is(t.context.fail, undefined)
})
