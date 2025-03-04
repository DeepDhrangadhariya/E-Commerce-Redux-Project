import dealsImg from '../../assets/deals.png'

const DealsSection = () => {
    return (
        <div className="section__container deals__container">
            <div className='deals__image'>
                <img src={dealsImg} alt="" />
            </div>

            <div className='deals__content'>
                <h5>Get Up To 20% Discount</h5>
                <h4>Deals Of The Months</h4>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure vitae saepe quod quos blanditiis assumenda soluta totam labore, adipisci quisquam non commodi culpa quas, ut suscipit veniam recusandae odit consequatur?</p>
                <div className='deals__countdown flex-wrap'>
                    <div className='deals__countdown__card'>
                        <h4>14</h4>
                        <p>Days</p>
                    </div>
                    <div className='deals__countdown__card'>
                        <h4>20</h4>
                        <p>Hours</p>
                    </div>
                    <div className='deals__countdown__card'>
                        <h4>15</h4>
                        <p>Mins</p>
                    </div>
                    <div className='deals__countdown__card'>
                        <h4>5</h4>
                        <p>Secs</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DealsSection