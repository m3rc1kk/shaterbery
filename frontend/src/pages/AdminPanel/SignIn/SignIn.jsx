import Input from "../../../components/Input/Input.jsx";
import ButtonLink from "../../../components/Button/ButtonLink.jsx";

export default function SignIn() {
    return (
        <>
            <div className="sign-in">
                <form action="" className="sign-in__form container">
                    <h2 className="sign-in__title">Админ Панель</h2>
                    <div className="sign-in__inputs">
                        <Input
                            id="login"
                            label="Логин"
                            placeholder="Admin"
                            required
                        />

                        <Input
                            id="password"
                            label="Password"
                            placeholder="*********"
                            required
                        />
                    </div>

                    <ButtonLink type={'submit'} className={'sign-in__button button__main'}>Вход</ButtonLink>
                </form>
            </div>
        </>
    )
}