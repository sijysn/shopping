import { Row, Col, Card, CardImg, CardBody, CardTitle } from "reactstrap";
import Link from "next/link";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";

const query = gql`
  {
    restaurants {
      data {
        id
        attributes {
          name
          description
          image {
            data {
              attributes {
                url
              }
            }
          }
        }
      }
    }
  }
`;

const RestaurantList = (props) => {
  const { loading, error, data } = useQuery(query);
  if (error) return "レストランの読み込みに失敗しました";
  if (loading) return "読み込み中";
  if (data) {
    const searchQuery = data.restaurants.data.filter((restaurant) =>
      restaurant.attributes.name.toLowerCase().includes(props.search)
    );
    return (
      <Row>
        {searchQuery.map((res) => (
          <Col xs="6" sm="4" key={res.id}>
            <Card style={{ margin: "0 0.5rem 20px 0.5rem" }}>
              <CardImg
                src={`${process.env.NEXT_PUBLIC_API_URL}${res.attributes.image.data[0].attributes.url}`}
                top={true}
                style={{ height: 250 }}
              />
              <CardBody>
                <CardTitle>{res.attributes.name}</CardTitle>
                <CardTitle>{res.attributes.description}</CardTitle>
              </CardBody>
              <div className="card-footer">
                <Link
                  href={`/restaurants?id=${res.id}`}
                  as={`/restaurants/${res.id}`}
                >
                  <a className="btn btn-primary">もっと見る</a>
                </Link>
              </div>
            </Card>
          </Col>
        ))}

        <style jsx>
          {`
            a {
              color: white;
            }
            a:link {
              text-decoration: none;
              color: white;
            }
            a:hover {
              color: white;
            }
            .card-columns {
              column-count: 3;
            }
          `}
        </style>
      </Row>
    );
  } else {
    return <h1>レストランが見つかりませんでした。</h1>;
  }
};

export default RestaurantList;
