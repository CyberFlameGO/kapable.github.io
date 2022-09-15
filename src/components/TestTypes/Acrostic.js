import axios from 'axios';
import React, { useState } from 'react';
import "../css/acrostic.css";
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Acrostic = () => {
    const [userInput, setUserInput] = useState(""); // input by the user
    const [isLoading, setIsLoading] = useState(false); // set is loading
    const [acrosticResult, setAcrosticResult] = useState([]); // the outputs
    const [isWriting, setIsWriting] = useState(true);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // check length of userInput
        if(userInput.length < 1) return alert("최소 한 글자 이상 넣어주세요!");
        if(userInput.length > 5) return alert("최대 다섯 글자까지 입력할 수 있습니다!"); 

        try {
            // loading start
            setIsLoading(true);

            // POST request to API
            await axios.post(
                'https://demo.tunib.ai/api/text/nverse',
                {
                    user_input: userInput
                },
                {'Content-Type' : 'application/json'}
            )
            .then(res => {
                // loading ending
                setIsLoading(false);

                // set outputs
                setAcrosticResult(res.data.outputs);

                // reset userInput
                setUserInput("");

                setIsWriting(false);
                console.log(res.data.outputs);
            });
        } catch (error) {
            console.log(error);
            return alert("에러가 발생했습니다ㅠㅠ 다시 시도해주세요ㅠㅠ");
        };
    };

    const handleReDo = () => {
        if(window.confirm("결과는 저장되지 않아요!\n이미지를 캡쳐하셨나요?")) {
            setIsWriting(true);
            setUserInput("");
        } else {
            return null;
        };
    };

    return (
        <div className='acrostic-background-div'>
            <img alt="acrostic-background-img" src="https://images.ktestone.com/Acrostic/Acrostic-background.png" className='acrostic-background-img'/>
            <form className='acrostic-form' onSubmit={handleSubmit}>
                <textarea className='acrostic-form-input'
                    type="textarea" minLength={1} maxLength={5}
                    value={isWriting ? userInput : acrosticResult.join(`\n\n`)}
                    placeholder='최대 다섯 글자까지 넣어주세요!' onChange={(e) => setUserInput(e.target.value)} />

                <input style={!(isWriting || isLoading) ? { display: 'none' } : null} className='acrostic-form-button' type="image" src="https://images.ktestone.com/Acrostic/Acrostic-check-button.png" alt="제출버튼" />
            </form>
            <div className='acrostic-button-container' style={isWriting || isLoading ? { display: 'none' } : null }>
                <CopyToClipboard text={'https://ktestone.com/kapable.github.io/acrostic/'}>
                    <div style={{ width: '50%', float: 'left', cursor: 'pointer' }} onClick={() => alert("링크가 복사됐어요!\n결과 텍스트는 복사되지 않아요!\n이미지를 캡쳐해서 공유해주세요!")}>
                        <img alt="acrostic-share-img" src="https://images.ktestone.com/Acrostic/Acrostic-share-button.png" className='acrostic-share-img'/>
                    </div>
                </CopyToClipboard>
                <div style={{ width: '50%', float: 'right', cursor: 'pointer' }} onClick={handleReDo}>
                    <img alt="acrostic-reDo-img" src="https://images.ktestone.com/Acrostic/Acrostic-reDo-button.png" className='acrostic-reDo-img'/>
                </div>
            </div>
            <p className='acrostic-form-p'>*출처: tunib</p>
            <div className='acrostic-loading-div'>
                {isLoading ? ("로딩중..") : (null)}
            </div>
        </div>
    );
};

export default Acrostic;