export interface IMenuItem {
    path: string;
    title: string;
    icon: any;
}

export interface ISubMenuItem {
    path: string;
    title: string;
    target?: "newTab"
}
