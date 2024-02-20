import { useState, useRef } from 'react';
import Head from 'next/head'
import 'bootstrap/dist/css/bootstrap.min.css';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState('');

  // refではなくuseStateを用いてフォームの状態を管理
  const [inputs, setInputs] = useState({
    user_name: '',
    password: '',
  });

  // 各入力フィールドのref
  const userNameRef = useRef();
  const passwordRef = useRef();

  const handleKeyDown = (event, inputName) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (inputName === 'user_name') {
        // ユーザー名フィールドでEnterが押されたらパスワードフィールドにフォーカスを移動
        passwordRef.current.focus();
      } else if (inputName === 'password') {
        login(); // パスワードフィールドでEnterが押されたらログインを実行
      }
    }
  };

  const login = () => {
    // ローディングを開始
    setIsLoading(true);

    // Stateからユーザー名とパスワードを取得
    const { user_name, password } = inputs;

    fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_name, password }),
    })
      .then(response => {
        if (response.redirected) {
          window.location.href = response.url; // レスポンスからリダイレクトURLを取得して遷移
        } else {
          throw new Error('Bad request');
        }
      })
      .catch(error => {
        console.error('エラー:', error);
        setWarning('ログインに失敗しました。');
      })
      .finally(() => {
        // ローディングを停止
        setIsLoading(false);
      });
  };

  // 入力値の変更をstateに反映するハンドラー
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs(prevInputs => ({
      ...prevInputs,
      [name]: value
    }));
  };

  return (
    <div>
      <Head>
        <title>ページのタイトル</title>
      </Head>
      <div className="container">
        <h1 className="mt-5 mb-4 text-center">ログイン</h1>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <a href="/Signup" className="d-block mb-3">
              アカウントをお持ちでない方はこちら
            </a>
            <div className="container">
              <form id="form">
                <div className="form-group">
                  <label htmlFor="user_name">ユーザー名</label>
                  <input
                    type="text" // typeを"username"から"text"に変更
                    className="form-control"
                    id="user_name"
                    name="user_name" // name属性を"username"から"user_name"に変更
                    required
                    ref={userNameRef}
                    value={inputs.user_name} // valueをstateから取得
                    onChange={handleChange} // 入力値の変更をハンドル
                    onKeyDown={(event) => handleKeyDown(event, 'user_name')}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="password">パスワード</label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    required
                    ref={passwordRef}
                    value={inputs.password} // valueをstateから取得
                    onChange={handleChange} // 入力値の変更をハンドル
                    onKeyDown={(event) => handleKeyDown(event, 'password')}
                  />
                </div>
                <button
                  id="login"
                  type="button"
                  className="btn btn-primary"
                  onClick={login}
                  disabled={isLoading} // ボタンを無効にすることで連続クリックを防ぐ
                >
                  {isLoading ? 'ログイン中...' : 'ログイン'}
                </button>

              </form>
              <div id="warning" className="mt-2" style={{ color: 'red' }}>
                {warning}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
