 // maintain state and controls user input if it's an empty string
 
import React, {useEffect, useState} from 'react';

export const useGlobalEffect = () => {

    const [invalid, setInvalid] = useState(false);
    const emptyContent = () => setInvalid(false);

   useEffect(() => { 
            const timeout = setTimeout(emptyContent, 1000)
            return (() => clearTimeout(timeout))
             }, [invalid]);

   return { invalid, setInvalid };
}
