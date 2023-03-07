import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { palette } from "../myPalettes";
import styled from "styled-components";
import { SketchPicker } from "react-color";

const Palette = () => {
  //
  const { id } = useParams();
  const initialPalette = palette.find((p) => p.name === id);
  //

  const [myPalette, setMyPalette] = useState(() => {
    const savedPalette = localStorage.getItem(`myPalette-${id}`);
    return savedPalette ? JSON.parse(savedPalette) : initialPalette;
  });
  //
  //
  const [toRgb, setToRgb] = useState("hex");
  const [toggleColorPicker, setToggleColorPicker] = useState(false);
  const [colorPickerColor, setColorPickerColor] = useState("#fff");
  const [currentColor, setCurrentColor] = useState("");
  //
  //

  useEffect(() => {
    localStorage.setItem(`myPalette-${id}`, JSON.stringify(myPalette));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myPalette]);

  //
  const toggleToRGB = (event) => {
    if (event.target.value === "rgb") {
      setToRgb("rgb");
    } else {
      setToRgb("hex");
    }
    console.log(event.target.value);
    console.log(toRgb);
  };
  //
  const handleColorChange = (clr) => {
    setColorPickerColor(clr.hex);
  };
  //
  const handleFullColorClick = (e) => {
    setCurrentColor(e);
    setTimeout(() => {
      setCurrentColor("");
    }, 1000);
  };
  //
  const createColor = () => {
    if (!colorPickerColor) {
      return;
    } else {
      const newColors = [...myPalette.colors];
      if (newColors.length < 20) {
        newColors.push(colorPickerColor);
        setMyPalette({ ...myPalette, colors: newColors });
      } else {
        alert(
          "Maximum colors limit reached(i.e 20).... delete a color to add new one"
        );
      }
      setToggleColorPicker(!toggleColorPicker);
    }
  };
  //
  const handleCopy = (e) => {
    const text = e.target.innerText;
    navigator.clipboard.writeText(text);
  };
  //
  const deleteColor = (i) => {
    const newClrs = [...myPalette.colors];
    newClrs.splice(i, 1);
    setMyPalette({ ...myPalette, colors: newClrs });
  };
  //
  const clear = () => {
    setMyPalette({ ...myPalette, colors: [] });
  };
  //

  const convertToRgb = (hex) => {
    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `rgb(${r}, ${g}, ${b})`;
  };

  //
  return (
    <PaletteStyled>
      <div className="header-items">
        <div className="link-con">
          <Link to={"/"}>&larr;&nbsp; Back</Link>
        </div>
        <div className="select-type">
          <select value={toRgb} onChange={toggleToRGB}>
            <option value="hex">HEX</option>
            <option value="rgb">RGB</option>
          </select>
        </div>
        <div className="right">
          <button
            className="btn-icon"
            onClick={() => setToggleColorPicker(!toggleColorPicker)}
          >
            <i className="fa-solid fa-palette"></i>
          </button>
          <button className="btn-icon" onClick={clear}>
            <i className="fa-solid fa-brush"></i>
          </button>
        </div>
      </div>
      {toggleColorPicker && (
        <div className="color-picker-con">
          <div className="color-picker">
            <SketchPicker
              color={colorPickerColor}
              onChange={handleColorChange}
              width="400px"
            />
            <button
              className="btn-icon"
              onClick={() => {
                createColor();
              }}
            >
              <i className="fa-solid fa-plus"></i> Add
            </button>
          </div>
          <div
            className="color-picker-overlay"
            onClick={() => setToggleColorPicker(!toggleColorPicker)}
          ></div>
        </div>
      )}
      <div className="colors">
        {myPalette.colors.map((clr, i) => {
          return (
            <div
              key={i}
              className="full-color"
              onClick={(e) => {
                handleCopy(e);
                handleFullColorClick(e.target.style.backgroundColor);
              }}
              style={{ background: clr }}
            >
              <h4>{toRgb === "hex" ? clr : convertToRgb(clr)}</h4>
              <button
                className="btn-icon"
                onClick={() => {
                  deleteColor(i);
                }}
              >
                <i className="fa-sharp fa-solid fa-trash"></i>
              </button>
            </div>
          );
        })}
      </div>
      {currentColor && (
        <div
          className="current-color"
          style={{ backgroundColor: currentColor }}
        >
          <div className="text">
            <h3>Copied!!!</h3>
          </div>
        </div>
      )}
    </PaletteStyled>
  );
};

const PaletteStyled = styled.div`
  position: relative;
  z-index: 5;
  width: 100%;
  .btn-icon {
    outline: none;
    cursor: pointer;
    font-size: 1.5rem;
    border: none;
    outline: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem 1rem;
    border-radius: 7px;
    color: white;
    background: #a855f7;
    transition: all 0.3s ease-in-out;
    &:hover {
      background: #0d0b33;
    }
  }
  .header-items {
    height: 6vh;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background-color: #fff;
    .link-con {
      a {
        text-decoration: none;
        font-family: inherit;
        font-size: inherit;
        color: #000;
        font-weight: 500;
        width: 50%;
      }
    }
    select {
      font-family: inherit;
      font-size: inherit;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 5px;
      outline: none;
      color: #fff;
      background-color: #000;
      cursor: pointer;
    }
    .right {
      display: flex;
      align-items: center;
      gap: 0.8rem;
      button:last-child {
        background-color: red;
        &:hover {
          background: #8b0000;
        }
      }
    }
  }
  .current-color {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    transform: scale(0);
    transition: all 0.3s ease-in-out;
    animation: show 0.3s ease-in-out forwards;
    .text {
      background: rgba(255, 255, 255, 0.26);
      padding: 2rem 6rem;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.09);
      h3 {
        text-align: center;
        font-size: 5rem;
        color: white;
        font-weight: 700;
        text-transform: uppercase;
        text-shadow: 3px 5px 7px rgba(0, 0, 0, 0.1);
      }
    }
    @keyframes show {
      0% {
        transform: scale(0);
        opacity: 0;
      }
      100% {
        transform: scale(1);
        opacity: 1;
      }
    }
  }
  .colors {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    width: 100%;
    min-height: 94vh;
    .full-color {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      h4 {
        font-size: 1.2rem;
        color: #fff;
        text-transform: uppercase;
        font-weight: 700;
        text-shadow: 3px 3px 1px rgba(0, 0, 0, 0.2);
        pointer-events: none;
      }
      button {
        position: absolute;
        right: 0;
        bottom: 0px;
        border-bottom-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        padding: 0.3rem 0.4rem;
        font-size: 1.1rem;
        color: #fff;
        background: transparent;
        filter: drop-shadow(0 3px 0.3rem rgba(0, 0, 0, 0.4));
      }
    }
  }
  .color-picker-con {
    .sketch-picker {
      box-shadow: 3px 3px 15px rgba(0, 0, 0, 0.5) !important;
    }
    .color-picker {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
      button {
        display: flex;
        margin-top: 0.5rem;
        width: 100%;
        align-items: center;
        gap: 0.5rem;
        box-shadow: 2px 2px 15px rgba(0, 0, 0, 0.5);
      }
    }
    .color-picker-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
      z-index: 1;
    }
  }
`;

export default Palette;
