import * as webcc from 'webcc'

export default class webccCreator {
    static create(){
      return new webcc.Runtime('token provided after purchased license');
    }
}