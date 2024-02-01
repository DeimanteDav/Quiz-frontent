import { render, screen } from '@testing-library/react';
// import App from './App';
import TestFirst from './TestFirst';
import userEvent from '@testing-library/user-event';

// test('renders learn react link', () => {
//   render(<TestFirst />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });


// Tree A's: Arrange, Act, Assert

describe('TestFirst component', () => {
  test('renders "Hello world" text', () => {
    render(<TestFirst />)
    // const textElement = screen.getByText(/hello world/i)
    const textElement = screen.getByText('hello world', {exact: false})
    expect(textElement).toBeInTheDocument()
  })
  
  test('renders "Change text" button', () => {
    render(<TestFirst />)
    // const buttonElement = screen.getByText('change text', {exact: false})
    const buttonElement = screen.getByRole('button')
    expect(buttonElement).toBeInTheDocument()
  })

  test('renders "changed" if the button was clicked', () => {
    // Arrange
    render(<TestFirst />)

    // Act
    const buttonElement = screen.getByRole('button')    
    userEvent.click(buttonElement)
    
    // Assert
    const textElement = screen.getByText('changed', {exact: false})
    expect(textElement).toBeInTheDocument()
  })
})


