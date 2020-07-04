// @flow
import type {PageSetup} from "../pagesetup/PageSetupTypes";

export type PageSetupState = {|
    pageSetup: ?PageSetup,
    fetchStatus: ?number
|}