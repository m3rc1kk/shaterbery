import { createContext, useContext, useEffect, useState } from 'react';
import { fetchCities } from '../api/cities.js';

const STORAGE_KEY = 'selected_city';

const CityContext = createContext(null);

export function CityProvider({ children }) {
    const [cities, setCities] = useState([]);
    const [citySlug, setCitySlug] = useState(
        () => localStorage.getItem(STORAGE_KEY) || null
    );

    useEffect(() => {
        let cancelled = false;
        fetchCities()
            .then((data) => {
                if (!cancelled) {
                    setCities(data);
                    setCitySlug(prev => {
                        if (prev && data.some(c => c.slug === prev)) return prev;
                        return data.length > 0 ? data[0].slug : prev;
                    });
                }
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    function setCity(slug) {
        localStorage.setItem(STORAGE_KEY, slug);
        setCitySlug(slug);
    }

    const cityData = cities.find((c) => c.slug === citySlug) ?? null;

    return (
        <CityContext.Provider value={{ citySlug, cityData, cities, setCity }}>
            {children}
        </CityContext.Provider>
    );
}

export function useCity() {
    return useContext(CityContext);
}
