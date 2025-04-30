
interface ICoordinates {
    x: number;
    y: number;
}

export interface IPlot extends ICoordinates {
    amount: number;
    sale_price: number;
    city: string;
    status: "pending" | "land";
    type: "plot";
    info: string | object;
    owner?: string; // if empty - mayor plot
    username?: string;
    ts: number;
    plot_num: number; // add from key ex.: [`plot_${plot_num}`]

    last_transfer_ts?: number;
    last_rental_ts?: number;
    ref_plot_num?: number;
    rented_amount?: number;
    rental_expiry_ts?: number;
}

export interface IHouse extends ICoordinates {
    amount: number;
    city: string;
    type: "house";
    house_num: number; // add from key ex.: [`house_${house_num}`]
    info: string | object;
    owner?: string; // if empty - mayor house
    username?: string;
    plot_num: number;
    plot_ts: number;
    shortcode?: string;
    shortcode_price?: number;
    ts: number;
}

export interface IRoad extends ICoordinates {
    name: string;
    orientation: "vertical" | "horizontal";
}
