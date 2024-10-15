import bcrypt from 'bcrypt';

export const hash = async (data, saltRounds = 10) => {
    try {
        const hashedData = await bcrypt.hash(data, saltRounds);
        return hashedData;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const compare = async (data, hashedData) => {
    try {
        const match = await bcrypt.compare(data, hashedData);
        return match;
    } catch (error) {
        throw new Error(error.message);
    }
}