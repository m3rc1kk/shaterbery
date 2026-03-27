import Header from "../../components/Header/Header.jsx";
import Hero from "../../components/Hero/Hero.jsx";
import Section from "../../components/Section/Section.jsx";
import HowItWorks from "../../components/HowItWorks/HowItWorks.jsx";

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
                    title={'Как это работает'}
                    subtitle={'01 - Процесс'}
                >
                    <HowItWorks />
                </Section>
            </main>
        </>
    )
}