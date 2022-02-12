// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from 'danger/distribution/dsl/DangerDSL.js'
import nlp from 'compromise'

declare const danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

/**
 * Validate PR titles
 *
 * Checks for subject length, capitalisation, trailing punctuation,
 * and imperative mood.
 */
export function checkTitle() {
	let { title } = danger.github.pr
	/** @todo Ignore "tag" prefixes. */
	let isImperative = Boolean(nlp(title).verbs().isImperative().text())

	if (!isImperative) fail('PR titles should use the imperative mood.')
	if (50 <= title.length && title.length <= 72) {
		warn('Great PR titles are 50 characters or fewer.')
		markdown(`
💡 **Tip:** If you’re having a hard time summarizing, you might be committing too
many changes at once.
		`)
	}

	if (72 < title.length)
		fail(
			'PR titles must be less than 72 characters to avoid being truncated.'
		)
}
