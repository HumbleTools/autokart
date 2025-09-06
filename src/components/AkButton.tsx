import classNames from "classnames";
import styles from './buttons.module.css';

interface AkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant: 'white' | 'blue';
    text: string;
}

const AkButton = ({variant, text, ...rest }: AkButtonProps) =>
    <button className={classNames(styles.akButton, styles[variant])} {...rest}>{text}</button>;

export default AkButton;