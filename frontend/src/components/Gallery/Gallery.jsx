import { useEffect, useMemo, useState } from 'react'
import example1 from '../../assets/images/gallery/example.jpg'
import example2 from '../../assets/images/gallery/example1.jpg'
import example3 from '../../assets/images/gallery/example2.jpg'
import example4 from '../../assets/images/gallery/example3.jpg'
import example5 from '../../assets/images/gallery/example4.jpg'
import example6 from '../../assets/images/gallery/example5.jpg'
import example7 from '../../assets/images/gallery/example6.jpg'
import example8 from '../../assets/images/gallery/example7.jpg'
import arrowRight from '../../assets/images/gallery/arrow-right.svg'
import arrowLeft from '../../assets/images/gallery/arrow-left.svg'
import ButtonLink from "../Button/ButtonLink.jsx";

const IMG_W = 1600
const IMG_H = 800

export default function Gallery() {
    const slides = useMemo(
        () => [
            { src: example1, alt: 'Пример установки 1' },
            { src: example2, alt: 'Пример установки 2' },
            { src: example3, alt: 'Пример установки 3' },
            { src: example4, alt: 'Пример установки 4' },
            { src: example5, alt: 'Пример установки 5' },
            { src: example6, alt: 'Пример установки 6' },
            { src: example7, alt: 'Пример установки 7' },
            { src: example8, alt: 'Пример установки 8' },
        ],
        []
    )

    const [index, setIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
    )

    useEffect(() => {
        slides.forEach(({ src }) => {
            const img = new Image()
            img.src = src
        })
    }, [slides])

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767px)')
        const onChange = () => setIsMobile(mq.matches)
        onChange()
        mq.addEventListener('change', onChange)
        return () => mq.removeEventListener('change', onChange)
    }, [])

    const thumbCount = isMobile ? 2 : 4
    const len = slides.length
    const prev = () => setIndex((i) => (i - 1 + len) % len)
    const next = () => setIndex((i) => (i + 1) % len)
    const current = slides[index]

    const thumbIndices = useMemo(() => {
        if (len <= 1) return []
        const out = []
        let k = 1
        while (out.length < thumbCount) {
            const idx = (index + k) % len
            if (idx !== index) {
                out.push(idx)
            }
            k++
            if (k > len * (thumbCount + 20)) break
        }
        return out
    }, [index, len, thumbCount])

    return (
        <div className="gallery">
            <div className="gallery__inner">
                <div className="gallery__buttons">
                    <ButtonLink type={'button'} onClick={prev} className={'gallery__button'}>
                        <img src={arrowLeft} width={12} height={38} loading='lazy' alt="Предыдущая" className="gallery__button-image"/>
                    </ButtonLink>
                    <ButtonLink type={'button'} onClick={next} className={'gallery__button'}>
                        <img src={arrowRight} width={12} height={38} loading='lazy' alt="Следующая" className="gallery__button-image"/>
                    </ButtonLink>
                </div>
                <div className="gallery__track">
                    <div className="gallery__main">
                        <img key={index} src={current.src} width={IMG_W} height={IMG_H} loading="eager" decoding="async" alt={current.alt} className="gallery__image"/>
                    </div>
                    {thumbIndices.map((slideIdx, i) => {
                        const slide = slides[slideIdx]
                        return (
                            <ButtonLink
                                key={`thumb-${thumbCount}-${i}`}
                                type="button"
                                className="gallery__thumb"
                                onClick={() => setIndex(slideIdx)}
                                aria-label={`Слайд ${slideIdx + 1}`}
                            >
                                <img src={slide.src} alt="" width={IMG_W} height={IMG_H} loading="eager" decoding="async" className="gallery__preview"/>
                            </ButtonLink>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
