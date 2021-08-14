import styled from "styled-components";

export const Title = styled.h1<{ color?: string }>`
	font-size: 2rem;
	color: ${({ color }) => (color ? color : "red")};
`;
