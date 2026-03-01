import React from 'react';
import InputSpinner from 'react-native-input-spinner';
import { useTheme } from '../context';
import { QuantitySpinnerProps } from '../utils/types';


const QuantitySpinner: React.FC<QuantitySpinnerProps> = ({
    value,
    onChange,
    min = 1,
    max = 10,
    step = 1,
    width = 90,
    height = 25,
    style
}) => {
    const { colors, isDark } = useTheme();

    return (
        <InputSpinner
            max={max}
            min={min}
            step={step}
            colorMax={colors.error}
            colorMin={colors.primary}
            value={value}
            onChange={onChange}
            skin="square"
            buttonStyle={{ backgroundColor: colors.primary, width: height - 4, height: height - 4, borderRadius: (height - 4) / 2 }}
            height={height}
            width={width}
            fontSize={height * 0.6}
            buttonFontSize={height * 0.6}
            buttonTextColor="#fff"
            style={[
                {
                    borderWidth: 1,
                    borderColor: isDark ? '#FFFFFF1A' : '#D9D9D9',
                    borderRadius: 6,
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                style
            ]}
            inputStyle={{
                height: height,
                paddingVertical: 0,
                textAlign: 'center',
                textAlignVertical: 'center',
                lineHeight: height,
                color: colors.text,
            } as any}
        />
    );
};

export default QuantitySpinner;
