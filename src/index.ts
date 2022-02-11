// Provides dev-time type structures for  `danger` - doesn't affect runtime.
import { DangerDSLType } from '../node_modules/danger/distribution/dsl/DangerDSL.js'

declare const danger: DangerDSLType
export declare function message(message: string): void
export declare function warn(message: string): void
export declare function fail(message: string): void
export declare function markdown(message: string): void

/**
 * PRs
 */
export default function prfect() {
	// Replace this with the code from your Dangerfile
	let { title } = danger.github.pr
	message(`PR Title: ${title}`)
}
