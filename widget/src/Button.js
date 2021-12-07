const Button = (props) => {
    const { image, name } = props;

    let hero = "https://ziprof.co.ke/assets/img/eazzypay.png"
    if (image.length) {
        hero = image
    }

    return (
        <div className="button-container" id="button-container">
            <div className="button-image">
                <img src={hero} alt={name} />
            </div>
            <div className="button-info">
                <h1>{name}</h1>
            </div>
        </div>
    )
}

export default Button
