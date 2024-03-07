import { useEffect } from "react";
import { User } from "@supabase/auth-helpers-nextjs";

import styles from "./auth.module.scss";
import { IconButton } from "./button";

import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import { useAccessStore } from "../store";
import Locale from "../locales";

import BotIcon from "../icons/bot.svg";
import LeftIcon from "../icons/left.svg";
import { getClientConfig } from "../config/client";

export function AuthPage({user}: {user: string | null}) {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  const goHome = () => navigate(Path.Home);
  const goChat = () => navigate(Path.Chat);
  const resetAccessCode = () => {
    accessStore.update((access) => {
      access.openaiApiKey = "";
      access.accessCode = "";
    });
  }; // Reset access code to empty string

  useEffect(() => {
    if (getClientConfig()?.isApp) {
      navigate(Path.Settings);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    {user? (<div>You've signed in.</div>) : (
      <div className={styles["auth-container"]}>
        <div className={styles["auth-header"]}>
          <IconButton
            key="retrun"
            icon={<LeftIcon />}
            text="Return"
            onClick={() => navigate(Path.Home)}
          />          
        </div>
      <div className={styles["auth-page"]}>
      <div className={`no-dark ${styles["auth-logo"]}`}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>{Locale.Auth.Title}</div>
      <div className={styles["auth-tips"]}>{Locale.Auth.Tips}</div>

      <input
        className={styles["auth-input"]}
        type="email"
        placeholder={Locale.Auth.EmailInput}
        value={accessStore.accessCode}
        onChange={(e) => {
          accessStore.update(
            (access) => (access.accessCode = e.currentTarget.value),
          );
        }}
      />
      <input
        className={styles["auth-input"]}
        type="password"
        placeholder={Locale.Auth.PasswordInput}
        value={accessStore.accessCode}
        onChange={(e) => {
          accessStore.update(
            (access) => (access.accessCode = e.currentTarget.value),
          );
        }}
      />
      <div className={styles["auth-actions"]}>
        <IconButton
          text={Locale.Auth.SignIn}
          type="primary"
          onClick={goChat}
        />
        <IconButton
          text={Locale.Auth.SignUp}
          onClick={() => {
            resetAccessCode();
            goHome();
          }}
        />
      </div>
    </div>
    </div>
    )}
    </>
  )
}
