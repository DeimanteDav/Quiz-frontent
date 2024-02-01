import { useEffect, useState } from "react";

export default function useLocalStorage(key, initialValue) {
    const [value, setValue] = useState(() => {
        return getLocalStorageValue(key, initialValue)
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])

    return [value, setValue]
}


function getLocalStorageValue(key, initialValue) {
    const localStorageValue = JSON.parse(localStorage.getItem(key))
    // const localStorageValue = localStorage.getItem(key)

    if (localStorageValue) {
        return localStorageValue
    }

    // if (typeof initialValue === 'function')
    if (initialValue instanceof Function) {
        return initialValue()
    }

    return initialValue
}