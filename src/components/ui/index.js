import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Button = styled.button`
  cursor: pointer;
  border-radius: 5px;
  border: none;
  font-size: 18px;
  color: #FFF;
`;

export const LinkButton = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
`;

export const TopBarContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  background: #191818;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 10px;
`;

export const TopBarButton = styled.img`
  position: absolute;
  top: 50%;
  left: 15px;
  height: 30px;
  width: 30px;
  transform: translateY(-50%);
  cursor: pointer;
`;

export const TopBarTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  max-width: ${props => props.theme.mobile};
  margin: 0 15px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  width: 100%;
  max-width: ${props => props.theme.mobile};
  margin: 0 15px;
`;

export const FormButton = styled.button`
  font-size: 20px;
  height: 55px;
  background: ${props => props.theme.auth.background};
  margin-top: 17px;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
`;

export const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 17px 0;
`;

export const Label = styled.label`
  font-size: 18px;
  margin-bottom: 2px;
`;

export const Overlay = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  z-index: 10000;
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    opacity: ${props => props.show ? 1 : 0};
    transition: opacity 0.2s cubic-bezier(0, 0, 0.3, 1);
    will-change: opacity
  }
`;
