import styled from 'styled-components';

export const Box = styled.div`
padding: 40px 40px;
background: #970647;
position: relative;
bottom: 0;
width: 100%;



@media (max-width: 1000px) {
	padding: 30px 30px;
}
`;

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	max-width: 1000px;
	
	/* background: red; */
`

export const Column = styled.div`
display: flex;
flex-direction: column;
text-align: left;
margin-left: 150px;
`;

export const Row = styled.div`
display: grid;
grid-template-columns: repeat(auto-fill,
						minmax(185px, 1fr));
grid-gap: 20px;

@media (max-width: 1000px) {
	grid-template-columns: repeat(auto-fill,
						minmax(200px, 1fr));
}
`;

export const FooterLink = styled.a`
color: #fff;

font-size: 18px;
text-decoration: none;

&:hover {
	color: ffe9ec;
	transition: 200ms ease-in;
}
`;

export const Heading = styled.p`
font-size: 20px;
color: #fff;

font-weight: bold;
`;
