
export class Code {

    constructor(
        public id?: number | null,
        public code?: string,
        public state?: number,
        public time?: number,
        public email?: string,
    ) {}

}

export class CodeState {
    public static CODE_CAN_USE = 1;
    public static CODE_ALREADY_USEED = 2;
    public static CODE_ALREADY_INVALID = 3;

    public static checkCodeTimeIsValid(code: Code): boolean {
        const currentTime = Math.floor(new Date().getTime() / 1000);
        return (currentTime - (code.time as number)) < (24 * 60 * 60);
    }
}
