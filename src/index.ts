import nlp from 'compromise'
// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL.js'

import {
	IMPERATIVE_ERROR,
	IMPERATIVE_TIP,
	LENGTH_ERROR,
	LENGTH_TIP,
	LENGTH_WARNING,
} from './messages.js'

declare const danger: DangerDSLType
// Declare function message(message: string): void
declare function warn(message: string): void
declare function fail(message: string): void
declare function markdown(message: string): void

interface CheckTitleOptions {
	/**
	 * Error type for imperative mood check.
	 * @default 'fail'
	 */
	imperativeMood?: false | 'warn' | 'fail'
	/**
	 * Should a character limit be enforced.
	 * @default true
	 */
	titleLength?: boolean
	returnOnly?: boolean
}

type CheckResult = 'pass' | 'warn' | 'fail'

interface CheckOutput {
	result?: CheckResult
	message?: string
	tip?: string
}

/**
 * Validate PR titles
 *
 * Checks for subject length, capitalisation, trailing punctuation,
 * and imperative mood.
 */
export function checkTitle(title?: string, options?: CheckTitleOptions) {
	title ||= danger.github.pr.title
	let { imperativeMood, titleLength, returnOnly } = options || {
		imperativeMood: 'fail',
		titleLength: true,
		returnOnly: false,
	}

	let imperativeMoodOutput: CheckOutput
	if (imperativeMood) {
		/** @todo Ignore "tag" prefixes. */
		let isImperative = Boolean(nlp(title).verbs().isImperative().text())

		if (!isImperative && !returnOnly) {
			if (imperativeMood === 'fail') fail(IMPERATIVE_ERROR)
			if (imperativeMood === 'warn') warn(IMPERATIVE_ERROR)
			markdown(IMPERATIVE_TIP)
		}

		imperativeMoodOutput = {
			result: isImperative ? 'pass' : imperativeMood,
			message: !isImperative && IMPERATIVE_ERROR,
			tip: !isImperative && IMPERATIVE_TIP,
		}
	}

	let titleLengthOutput: CheckOutput
	if (titleLength) {
		let lengthResult: CheckResult = 'pass'
		let lengthMessage: string
		if (50 <= title.length && title.length <= 72) {
			if (!returnOnly) warn(LENGTH_WARNING)
			lengthResult = 'warn'
			lengthMessage = LENGTH_WARNING
		}

		if (72 < title.length) {
			if (!returnOnly) fail(LENGTH_ERROR)
			lengthResult = 'fail'
			lengthMessage = LENGTH_ERROR
		}

		let showLengthTip = false
		if (50 <= title.length) {
			if (!returnOnly) markdown(LENGTH_TIP)
			showLengthTip = true
		}

		titleLengthOutput = {
			result: lengthResult,
			message: lengthMessage,
			tip: showLengthTip && LENGTH_TIP,
		}
	}

	return {
		imperativeMood: imperativeMoodOutput,
		titleLength: titleLengthOutput,
	}
}
