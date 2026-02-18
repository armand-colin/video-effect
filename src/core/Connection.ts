import { Component, Engine } from "@niloc/ecs";
import { Peer } from "./Peer";

export class Connection extends Component {

    private _local: Peer
    private _remote: Peer

    constructor(engine: Engine) {
        super(engine)

        this._local = new Peer(engine, { local: true })
        this._remote = new Peer(engine, { local: false })

        this._local.events.on('signal', signal => {
            this._remote.signal(signal)
        })

        this._remote.events.on('signal', signal => {
            this._local.signal(signal)
        })
    }

    get local() {
        return this._local
    }

    get remote() {
        return this._remote
    }

    destroy() {
        super.destroy()
        this._local.destroy()
        this._remote.destroy()
    }

}