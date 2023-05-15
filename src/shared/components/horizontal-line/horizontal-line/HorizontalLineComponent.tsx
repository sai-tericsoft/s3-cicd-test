import "./HorizontalLineComponent.scss";

interface HorizontalLineComponentProps {
className?: string;
}

const HorizontalLineComponent = (props: HorizontalLineComponentProps) => {
 const {className} = props;
    return (
        <div className={`horizontal-line-wrapper ${className}`}>

        </div>
    );

};

export default HorizontalLineComponent;