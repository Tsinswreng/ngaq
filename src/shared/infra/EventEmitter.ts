import * as Le from '@shared/linkedEvent'
import EventEmitter3 from 'eventemitter3'

export function mkEmitter(){
	return Le.LinkedEmitter.new(new EventEmitter3())
}