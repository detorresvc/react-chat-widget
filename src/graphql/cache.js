

import { InMemoryCache, makeVar, useReactiveVar } from '@apollo/client';
import Cookies from 'js-cookie';

export const isAthenticatedVar = makeVar(!!Cookies.get('echat:token'));

export {
  makeVar, 
  useReactiveVar
}


export default new InMemoryCache()