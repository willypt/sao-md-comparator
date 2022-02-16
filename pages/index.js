/** @jsxImportSource @emotion/react */

import {useEffect, useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import MasterCharacterNames from '../generated_assets/master_character_names.json'
import Button from '@mui/material/Button';
import {Autocomplete, Box, Container, Typography, Checkbox, TextField, CssBaseline} from "@mui/material";
import styled  from '@emotion/styled';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import {css} from '@emotion/react';
import isEqual from 'lodash/isEqual';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const MainStyle = styled('div')(({ theme }) => ({
  paddingTop: 60,
}));

const autoCompleteOptions = Object.entries(MasterCharacterNames).map(([key, value]) => {
  return { character_name: `${value} (${key})`, character_id: key }
})

const TableStyle = css`
  td {
    border: 1px black solid;
    max-width: 200px;
    overflow: hidden;
  }
  .characters {
    td {
      text-align: center;
    }
  }
  .names {
    td {
      font-family: 'Roboto';
      text-align: center;
      font-size: 0.8em;
    }
  }
  .fields {
    td {
      text-align: center;
    }
  }
`

function safePrint (val) {
  if (typeof val === 'string' || typeof val === 'number') return val;
  return JSON.stringify(val);
}

export default function Home() {
  const [selectedCharacters, setSelectedCharacters] = useState([]);
  const [tmpCharacters, setTmpCharacters] = useState([]);
  const [equality, setEquality] = useState({});

  const onClickButton = async () => {
    const resp = await fetch(`/api/character?ids=${selectedCharacters.map(c => c.character_id).join(',')}`, {
      method: 'GET'
    })
    const jsonObj = await resp.json();

    const characters = jsonObj?.units;
    const result = {};
    if (characters[0]){
      Object.keys(characters[0]).forEach((key) => {
        result[key] = characters.map(char => char[key]).every((v, _, arr) => {
          console.log('compare',key, v, arr[0], isEqual(v, arr[0]))
          return isEqual(v, arr[0])
        })
        console.log(key, result[key])
      })
    }
    setTmpCharacters(jsonObj?.units)
    setEquality(result)
    console.log({result})
  }

  return (
    <div className={styles.container}>
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
        />
        <title>SAO MD Comparator</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CssBaseline />

      <MainStyle>
        <Container maxWidth="xl">
          <Box sx={{ pb: 5 }}>
            <Typography variant="h4" marginBottom="30px">Start Connecting the Dots</Typography>
            <Autocomplete
              onChange={(event, values) => {
                setSelectedCharacters(values)
              }}
              multiple
              options={autoCompleteOptions}
              disableCloseOnSelect
              getOptionLabel={(option) => option.character_name}
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.character_name}
                </li>
              )}
              renderInput={(params) => (
                <TextField  {...params} label="Characters" placeholder="Select characters"  />
              )}
            />
            <Button onClick={onClickButton} style={{marginTop: '30px'}} fullWidth variant="contained">Compare & Search Similarities</Button>

            <div style={{marginTop: 50}}>
              <table width="100%" css={TableStyle}>
                <tbody>
                <tr className="characters">
                  <td></td>
                  {tmpCharacters.map(char => <td key={char.id}><img src={`/character_images/character_${char.id}.png`} height={200} /></td>)}
                </tr>
                <tr className="names">
                  <td></td>
                  {tmpCharacters.map(char => <td key={char.id}>{MasterCharacterNames[char.id]}</td>)}
                </tr>
                <tr>
                  <td colSpan={tmpCharacters.length + 1} style={{textAlign: 'center', height: '30px', backgroundColor: 'greenyellow'}}>
                    <Typography variant="h5" color="black">Same Values</Typography>
                  </td>
                </tr>
                {Object.entries(equality).filter(([key,value]) => value).map(([key]) => {
                  return <tr key={key} className="fields">
                    <td>
                      <Typography variant="h6">{key}</Typography>
                    </td>
                    {tmpCharacters.map(char => <td key={char.id}>{safePrint(char[key])}</td>)}
                  </tr>
                })}
                <tr>
                  <td colSpan={tmpCharacters.length + 1} style={{textAlign: 'center', height: '30px', backgroundColor: 'orange'}}>
                    <Typography variant="h5" color="black">Different Values</Typography>
                  </td>
                </tr>
                {Object.entries(equality).filter(([key,value]) => !value).map(([key]) => {
                  return <tr key={key} className="fields">
                    <td>
                      <Typography variant="h6">{key}</Typography>
                    </td>
                    {tmpCharacters.map(char => <td key={char.id}>{safePrint(char[key])}</td>)}
                  </tr>
                })}
                </tbody>
              </table>
            </div>
          </Box>
        </Container>
      </MainStyle>
    </div>
  )
}