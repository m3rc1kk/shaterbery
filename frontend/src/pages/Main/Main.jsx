import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import Section from "../../components/Section/Section.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";
import Gallery from "../../components/Gallery/Gallery.jsx";
import Services from "../../components/Services/Services.jsx";
import Reviews from "../../components/Reviews/Reviews.jsx";
import Application from "../../components/Application/Application.jsx";
import FAQ from "../../components/FAQ/FAQ.jsx";
import Footer from "../../components/Footer/Footer.jsx";

export default function Main() {
    const location = useLocation();

    useEffect(() => {
        if (!location.hash) return;
        const id = location.hash.slice(1);
        if (!id) return;
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    }, [location.pathname, location.hash]);

    return (
        <>
            <Header />
            <Hero />

            <main className="content">
                <Section
                    id="how-it-works"
                    title={'Как это работает'}
                    subtitle={'01 - Процесс'}
                >
                    <HowItWorks />
                </Section>

                <Section
                    id="gallery"
                    title={'Примеры установки'}
                    subtitle={'02 - Галерея'}
                >
                    <Gallery />
                </Section>

                <Section
                    id="services"
                    title={'Наши услуги'}
                    subtitle={'03 - Ассортимент'}
                >
                    <Services />
                </Section>

                <Section
                    id="reviews"
                    title={'Что говорят клиенты'}
                    subtitle={'04 - Отзывы'}
                >
                    <Reviews />
                </Section>

                <Section
                    id="order"
                    title={'Оставьте заявку'}
                    subtitle={'04 - Заказать'}
                >
                    <Application />
                </Section>

                <Section
                    id="faq"
                    title={'Частые вопросы'}
                    subtitle={'05 - FAQ'}
                >
                    <FAQ/>
                </Section>

                <Footer />

            </main>
        </>
    )
}