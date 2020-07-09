import React, { useState, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";
import { Item, Input, Icon } from "native-base";
import colors from "../../../../components/colors";

const SearchInput = props => {
  const { filter, resetFilter } = props;
  const inputRef = useRef(null);

  const onIconPress = () => {
    if (inputRef.current) {
      const { wrappedInstance } = inputRef.current;
      if (wrappedInstance.isFocused()) return wrappedInstance.blur();
      return wrappedInstance.focus();
    }
  };

  const [val, setVal] = useState("");

  useEffect(() => {
    if (val.trim()) {
      filter(val);
    } else {
      resetFilter();
    }
  }, [val]);

  const onChangeText = text => setVal(text);

  return (
    <Item style={styles.searchContainer}>
      <Icon
        onPress={onIconPress}
        active
        name="search"
        style={{ color: colors.secondary }}
      />
      <Input
        ref={inputRef}
        placeholderTextColor={colors.secondary}
        placeholder="Buscar por nombre o alias"
        style={{
          color: colors.mainBlue,
          fontStyle: val.trim() ? "normal" : "italic",
        }}
        value={val}
        onChangeText={onChangeText}
      />
    </Item>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row-reverse",
    width: "90%",
    justifyContent: "center",
    color: colors.mainBlue,
    borderColor: colors.mainBlue,
    borderWidth: 3,
  },
});

export default SearchInput;
