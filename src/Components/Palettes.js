import chroma from "chroma-js";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import slugify from "react-slugify";
import styled from "styled-components";
import { palette } from "../myPalettes";

const Palettes = () => {
  //

  const [myPalettes, setMyPalettes] = useState(palette);
  const [paletteName, setPaletteName] = useState("");
  const [localStoragePl, setLocalStoragePl] = useState([]);

  //

  useEffect(() => {
    myPalettes.forEach((palette, i) => {
      const savedPal = localStorage.getItem(`myPalette-${palette.name}`);
      if (!savedPal) {
        localStorage.setItem(
          `myPalette-${palette.name}`,
          JSON.stringify(palette)
        );
      }
    });
  }, [myPalettes]);

  //

  useEffect(() => {
    const palettes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith("myPalette-")) {
        const savedPalette = localStorage.getItem(key);
        if (savedPalette) {
          palettes.push(JSON.parse(savedPalette));
        }
      }
    }

    console.log("before sorting....", palettes);
    palettes.sort((a, b) => {
      return a.createdAt - b.createdAt;
    });
    console.log("after sorting...", palettes);

    setLocalStoragePl(palettes);
  }, []);

  //

  const generateRandomClrs = () => {
    const clrs = [];
    while (clrs.length < 20) {
      const color = chroma.random().hex();
      if (chroma.valid(color)) {
        clrs.push(color);
      }
    }
    return clrs;
  };
  // console.log(generateRandomClrs());
  //
  const addPalette = () => {
    const newPalette = {
      id: new Date().getTime(),
      name: slugify(paletteName),
      createdAt: new Date().getTime(),
      colors: generateRandomClrs(),
    };

    //
    const savedPalette = localStorage.getItem(`myPalette-${newPalette.name}`);
    if (savedPalette) {
      alert("This palette already exists....");
      return;
    }
    // else add to local storage...if doesn't exist
    localStorage.setItem(
      `myPalette-${newPalette.name}`,
      JSON.stringify(newPalette)
    );

    //
    setLocalStoragePl([...localStoragePl, newPalette]);

    setMyPalettes([...myPalettes, newPalette]);

    setPaletteName("");
  };
  //
  console.log(myPalettes);
  console.log(localStoragePl);

  return (
    <PalettesStyled>
      <div className="add-palette">
        <div className="input-control">
          <input
            type="text"
            placeholder="Create Palette here..."
            value={paletteName}
            onChange={(e) => {
              setPaletteName(e.target.value);
            }}
          />
          <button
            onClick={() => {
              addPalette();
            }}
          >
            +
          </button>
        </div>
      </div>
      <div className="palettes">
        {localStoragePl.map((p, i) => {
          // console.log(p.name);
          return (
            <Link to={`/palette/${p.name}`} key={p.name}>
              <div className="palette">
                {p.colors.map((c, i) => {
                  return (
                    <div
                      key={i}
                      className="color"
                      style={{ backgroundColor: c }}
                    ></div>
                  );
                })}
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <p>{p.name}</p>
                <button
                  className="btn-icon"
                  onClick={() => {
                    console.log(p.name);
                    alert("this feature will be available soon");
                  }}
                  style={{
                    zIndex: "10",
                    fontSize: "1.1rem",
                    outline: "none",
                    padding: ".3rem",
                    color: "red",
                    filter: "drop-shadow(0 3px 0.3rem rgba(0, 0, 0, 0.4))",
                    border: "none",
                    cursor: "pointer",
                    background: "transparent",
                  }}
                >
                  <i className="fa-sharp fa-solid fa-trash"></i>
                </button>
              </div>
            </Link>
          );
        })}
      </div>
    </PalettesStyled>
  );
};

const PalettesStyled = styled.div`
  position: relative;
  z-index: 5;
  .add-palette {
    padding-left: 18rem;
    padding-right: 18rem;
    padding-top: 4rem;
    padding-bottom: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin: 0 auto;
    transition: all 0.3s ease;
    @media screen and (max-width: 1670px) {
      width: 70%;
    }
    @media screen and (max-width: 1320px) {
      width: 90%;
    }
    @media screen and (max-width: 970px) {
      width: 100%;
      padding-left: 10rem;
      padding-right: 10rem;
    }

    @media screen and (max-width: 600px) {
      width: 100%;
      padding-left: 4rem;
      padding-right: 4rem;
      padding-top: 2rem;
      padding-bottom: 1.5rem;
    }
    input,
    button {
      font-family: inherit;
      font-size: inherit;
      outline: none;
      border: none;
    }

    .input-control {
      position: relative;
      width: 100%;
      box-shadow: 1px 4px 15px rgba(0, 0, 0, 0.12);
      input {
        width: 100%;
        padding: 0.5rem 1rem;
        border-radius: 7px;
        &::placeholder {
          color: #7263f3;
          opacity: 0.3;
        }
      }
      button {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        padding: 2px 1rem;
        cursor: pointer;
        font-size: 2rem;
        height: 100%;
        border-radius: 7px;
        background-color: #7263f3;
        color: white;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background-color: #5a4ed1;
        }
      }
    }
  }
  .palettes {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    grid-gap: 25px;
    padding: 2rem 10rem;
    transition: all 0.3s ease;
    @media screen and (max-width: 1432px) {
      padding: 2rem 8rem;
    }
    @media screen and (max-width: 1164px) {
      padding: 2rem 5rem;
    }
    @media screen and (max-width: 600px) {
      padding: 0.5rem 1rem;
    }
    a {
      text-decoration: none;
      display: inline-block;
      padding: 1rem;
      background-color: white;
      border-radius: 7px;
      box-shadow: 1px 3px 20px rgba(0, 0, 0, 0.2);
    }
    p {
      font-size: 1.5rem;
      padding-top: 0.5rem;
      display: inline-block;
      background: linear-gradient(90deg, #7263f3 20%, #f56692 50%, #6fcf97 60%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .palette {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      width: 100%;
      height: 250px;
      .color {
        width: 100%;
        height: 100%;
      }
    }
  }
`;

export default Palettes;
