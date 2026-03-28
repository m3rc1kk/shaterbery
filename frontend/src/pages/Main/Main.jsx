import Header from "../../components/Header/Header.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import Section from "../../components/Section/Section.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";
import Gallery from "../../components/Gallery/Gallery.jsx";
import Services from "../../components/Services/Services.jsx";
import Reviews from "../../components/Reviews/Reviews.jsx";

export default function Main() {
    return (
        <>
            <Header />
            <Hero />

            <main className="content">
                <Section
                    title={'Как это работает'}
                    subtitle={'01 - Процесс'}
                >
                    <HowItWorks />
                </Section>

                <Section
                    title={'Примеры установки'}
                    subtitle={'02 - Галерея'}
                >
                    <Gallery />
                </Section>

                <Section
                    title={'Наши услуги'}
                    subtitle={'03 - Ассортимент'}
                >
                    <Services />
                </Section>

                <Section
                    title={'Что говорят клиенты'}
                    subtitle={'04 - Отзывы'}
                >
                    <Reviews />
                </Section>

                <Section
                    title={'Что говорят клиенты'}
                    subtitle={'04 - Отзывы'}
                >
                    <Reviews />
                </Section>
            </main>
        </>
    )
}