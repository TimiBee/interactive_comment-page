// This custom hook is for maintaining the state of toggling.

import React, {useState} from 'react'

export const useToggle = () => {
    const [ canToggleUp, setCanToggleUp ] = useState(true)
    const [ canToggleDown, setCanToggleDown] = useState(true)
    return { canToggleUp, setCanToggleUp, canToggleDown, setCanToggleDown}
}

