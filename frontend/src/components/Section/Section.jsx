export default function Section({title, subtitle, children, id}) {
    return (
        <>
            <section className="section container" id={id}>
                <header className="section__header">
                    <span className="section__header-subtitle">{subtitle}</span>
                    <h1 className="section__header-title">{title}</h1>
                </header>

                <div className="section__content">
                    {children}
                </div>
            </section>
        </>
    )
}