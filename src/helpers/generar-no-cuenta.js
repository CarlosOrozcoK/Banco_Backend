import crypto from "crypto"
import Account from "../account/account.model.js" 

const generarNumeroCuenta = async () => {
    let numeroUnico = false;
    let numero;

    while (!numeroUnico) {
        const buffer = crypto.randomBytes(5);
        numero = parseInt(buffer.toString('hex'), 16)
            .toString()
            .padStart(10, '0')
            .slice(0, 10);

        const existe = await Account.exists({ noCuenta: numero });
        if (!existe) {
            numeroUnico = true;
        }
    }

    return numero;
};

export default generarNumeroCuenta;