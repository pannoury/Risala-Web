import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import axios from "axios";
import Layout from "../components/layout";
import useLocale from "../hooks/useLocale";
import { errorManagement, postRequest } from "../api/api";

export default function Restore(){
    const locale = useLocale();
    const router = useRouter()
    const { id, p } = router.query //id is the uuid, p is the purpose
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [account, setAccount] = useState(undefined);
    const [confirmed, setConfirmed] = useState(false)

    const [isPasswordVisible, setPasswordVisible] = useState(false)
    const [isRepeatVisible, setRepeatVisible] = useState(false);

    const [passwordChanged, setPasswordChanged] = useState(false)

    //Detect purpose
    useEffect(() => {
        if(id && p){
            if(p === "confirm_email"){
                confirmEmail()
            } else if(p === "restore_password"){
                getAccountId();
            } else if(p === "clean" && id === "0"){
                cronJobClean()
            }
        }
    }, [id, p])

    function getAccountId(){
        postRequest('accounts/restore-confirm', {
            id: id,
            purpose: p
        })
        .then((response) => {
            console.log(response)
            if(response.length === 1){
                setAccount(response[0].account_id)
                setIsLoading(false)
            } else {
                setError(true)
            }
            setIsLoading(false)
        })
        .catch((err) => {
            setIsLoading(false)
            setError(true)
            console.log(err)
        })
    }

    function changePassword(){
        var inputValue = document.querySelectorAll('input')
        if(inputValue[0].value === inputValue[1].value && inputValue[0].value.length >= 8){
            postRequest('accounts/change_password', {
                id: account,
                password: inputValue[0].value
            })
            .then((response) => {
                console.log(response)
                setPasswordChanged(true)
            })
            .catch((err) => {
                console.log(err)
            })
        } else {
            alert("L??senord m??ste matcha, samt vara l??ngre ??n 5 karakt??rer!")
        }
    }

    function confirmEmail(){
        postRequest('accounts/confirm', {id: id})
        .then((response) => {
            if(response.affectedRows === 1){
                setConfirmed(true)
                setIsLoading(false)
            } else {
                setIsLoading(false)
                setError(true)
            }
        })
        .catch((err) => {
            errorManagement(err)
            console.log(err)
        })
    }

    return(
        <Layout title={"Restore"} margin={"20vh"}>
            <div className="restore-main">
                {
                    isLoading === true &&
                    <div className="main-window">
                        <img src="https://codenoury.se/assets/logo-long-yellow.svg"/>
                        <div className="lazy-load">
                            <div className="skeleton"></div>
                        </div>
                        <div className="lazy-load short">
                            <div className="skeleton"></div>
                        </div>
                        <div className="lazy-load">
                            <div className="skeleton"></div>
                        </div>
                        <div className="lazy-load short">
                            <div className="skeleton"></div>
                        </div>
                        <div className="fake-button button button-yellow-square">
                            <div className="lds-dual-ring"></div>
                        </div>
                    </div> 
                }
                {
                    (p === "confirm_email" && !isLoading && !error) && 
                    <div className="main-window">
                        <img src="https://codenoury.se/assets/logo-long-yellow.svg"/>
                        <h1>{locale === "en" ? "Account confirmation succeeded!" : "Bekfr??ftelse lyckad!"}</h1>
                        <p>Ditt konto ??r nu bekfr??ftat, du kan nu logga in med ditt anv??ndarnamn (e-postadress) samt l??senord p?? inloggningsportalen. Portalen kommer du till genom att klicka p?? l??nken nedan</p>
                        <Link href="https://risala.codenoury.se/login">
                            <a className="button button-yellow-square">
                                {locale === "en" ? "Sign in" : "Logga in"}
                            </a>
                        </Link>
                    </div>    
                }
                {
                    (p === "restore_password" && !isLoading && !error) &&
                    <div className="main-window restore_password">
                        <img src="https://codenoury.se/assets/logo-long-yellow.svg"/>
                        <h1>Change password</h1>
                        {
                            !passwordChanged ?
                            <>
                                <p>Fyll i nedan och se till att l??senorden matchar, samt ??r l??ngre ??n 5 karakt??rer. Bekr??fta sedan genom att klicka p?? knappen nedan</p>
                                <label>New password</label>
                                <div className="password-input">
                                    <input 
                                        name="password" 
                                        type={isPasswordVisible === false ? "password" : "text"}
                                    ></input>
                                    <div onClick={(() => {setPasswordVisible(!isPasswordVisible)})}>
                                    {
                                        isPasswordVisible === false ?
                                        <i className="material-icons">visibility_off</i>
                                        :
                                        <i className="material-icons">visibility</i>
                                    }
                                    </div>
                                </div>
                                <label>Confirm new password</label>
                                <div className="password-input">
                                    <input 
                                        name="repeat-password" 
                                        type={isRepeatVisible === false ? "password" : "text"}
                                    ></input>
                                    <div onClick={(() => {setRepeatVisible(!isRepeatVisible)})}>
                                    {
                                        isRepeatVisible === false ?
                                        <i className="material-icons">visibility_off</i>
                                        :
                                        <i className="material-icons">visibility</i>
                                    }
                                    </div>
                                </div>
                                <button onClick={changePassword} className="button button-yellow-square">
                                    Change password
                                </button>
                            </>
                            :
                            <>
                                <p>L??senordet ??r nu bytt! Klicka p?? knappen nedan f??r att g?? till inloggningsportalen!</p>
                                <Link href="https://risala.codenoury.se/login">
                                    <a className="button button-yellow-square">
                                        { locale === "en" ? "Sign in" : "Logga in" }
                                    </a>
                                </Link>
                            </>
                        }
                    </div>
                }
                {
                    error &&
                    <div className="main-window">
                        <img src="https://codenoury.se/assets/logo-long-yellow.svg"/>
                        <h1>{locale === "sv" ? "N??got gick snett!" : "Something went wrong!"}</h1>
                        <p>{locale === "sv" ? "Webbservern kunde inte bekfr??fta eller tolka din efterfr??gan. Var god och kontakta administrat??r ifall detta inte ??r f??rv??ntant" : 
                        "The web server could not confirm or understand your request. If this is unexpected, then please reach out to the administrator or the owner of this website"}
                        </p>
                        <Link href="https://risala.codenoury.se">
                            <a className="button button-yellow-square">
                                {locale === "sv" ? "Ta mig h??rifr??n" : "Redirect me"}
                            </a>
                        </Link>
                    </div>
                }
            </div>
        </Layout>
    )
}