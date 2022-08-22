import { encode as b58encode } from 'bs58';
import { getSalt, randBuf, kdf } from "./crypto";

export type LinkMeta  = {
    slug: string;
    anchor: string;
};

const createMsg = (o: Object) => {
  return {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(o)
  };
}



export const insertPublicKey = (k: string, onInsert: (success: boolean) => void = () => {}) => {
  const msg = createMsg({publicKey: k});
  const endpoint = window.location.origin + "/api/insert_public_key";
  fetch(endpoint, msg).then((rr) => {
    onInsert(rr.status == 200);
  }).catch( () => {
    onInsert(false);
  });
}

export const getLinkPath = (pw: Buffer) => {
  return(
    "/i#" + b58encode(pw)
  );
}

// https://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript
export const removeURLParameter = (url: string, parameter: string) => {
  //prefer to use l.search if you have a location/link object
  const fragment = url.includes('#') ?  '#' + url.split('#')[1] : '';
  const urlparts = url.split('?');   
  if (urlparts.length >= 2) {

      const prefix = encodeURIComponent(parameter) + '=';
      var pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (var i = pars.length; i-- > 0;) {    
          //idiom for string.startsWith
          if (pars[i].lastIndexOf(prefix, 0) !== -1) {  
              pars.splice(i, 1);
          }
      }

      return(urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '') + fragment);
  }
  return(url);
}